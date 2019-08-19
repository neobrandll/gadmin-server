const db = require('../sql/db.js');
const actividadQueries = require('../sql/queries/actividad');
const ganadoQueries = require('../sql/queries/ganado');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

const ITEMS_PER_PAGE = 15;

exports.createParto = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      12,
      'No se tienen permisos para manipular partos'
    );
    const fe_actividad = req.body.feActividad;
    const de_actividad = req.body.deActividad;
    const id_tipo_actividad = req.body.idTipoActividad;
    const madre = req.ma_ganado;
    let padre;
    let id_toro = -1;
    let id_pajuela = -1;
    if (req.pa_ganado) {
      padre = req.pa_ganado;
      id_toro = req.pa_ganado.id_ganado;
    }
    if (req.pa_pajuela) {
      padre = req.pa_pajuela;
      id_pajuela = req.pa_pajuela.id_pajuela;
    }
    db.task(async con => {
      try {
        let id_raza;
        if (padre && madre.id_raza !== padre.id_raza) {
          const mestizoFound = await con.oneOrNone(ganadoQueries.deRazaExist, [
            'mestizo',
            id_empresa
          ]);
          if (mestizoFound) {
            id_raza = mestizoFound.id_raza;
          } else {
            const newMestizo = await con.one(ganadoQueries.createRaza, [id_empresa, 'Mestizo']);
            id_raza = newMestizo.id_raza;
          }
        } else {
          id_raza = madre.id_raza;
        }
        const actividad = await con.one(actividadQueries.createActividad, [
          id_tipo_actividad,
          de_actividad,
          fe_actividad
        ]);
        const crias = req.body.crias;
        let paramQuery =
          'INSERT into ganado ' +
          '(id_empresa ,id_raza, id_estado_ganado, fe_ganado ,id_pa_ganado ,' +
          'id_ma_ganado ,id_pa_pajuela ,fo_ganado ,id_tipo_ganado , ' +
          'pe_ganado , co_ganado ) VALUES ';
        const paramsArr = [
          id_empresa,
          id_raza,
          3,
          fe_actividad,
          id_toro,
          madre.id_ganado,
          id_pajuela,
          null
        ];
        let pCount = 9;
        const coArr = [];
        for (const cria of crias) {
          paramQuery += `($1, $2, $3, $4, $5, $6, $7,$8 ,$${pCount} ,$${pCount + 1} , $${pCount +
            2}),`;
          pCount += 3;
          paramsArr.push(cria.tipoGanado, cria.peGanado, cria.coGanado);
          coArr.push(cria.coGanado);
        }
        paramQuery = paramQuery.substring(0, paramQuery.length - 1);
        paramQuery += `; SELECT id_ganado FROM ganado WHERE id_empresa = $1 AND co_ganado IN(`;
        for (const coCria of coArr) {
          paramQuery += `$${pCount},`;
          pCount++;
          paramsArr.push(coCria);
        }
        paramQuery = paramQuery.substring(0, paramQuery.length - 1);
        paramQuery += ')';
        const idCriasArr = await con.many(paramQuery, paramsArr);
        let ag_query = 'INSERT INTO actividad_ganado (id_actividad, id_ganado) VALUES ';
        let ag_pCount = 2;
        const ag_paramArr = [actividad.id_actividad];
        for (const idCria of idCriasArr) {
          ag_query += `($1, $${ag_pCount}),`;
          ag_paramArr.push(idCria.id_ganado);
          ag_pCount++;
        }
        ag_query = ag_query.substring(0, ag_query.length - 1);
        await con.none(ag_query, ag_paramArr);
        res.status(201).json({ actividad, codigoCrias: coArr, msg: 'parto creado!' });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};
