import pool from './db.js';

const consultarDB = (consulta) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await pool.query(consulta);
            resolve(result);
        } catch (error) {
            console.log(error);
            reject("No se pudo traer la información de los registros.");
        }
    });
};

const nuevoPost = async (usuario, URL, descripcion, likes) => {
    try {
        const query = {
            text: "INSERT INTO posts (usuario, url, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING id, usuario, URL, descripcion, likes",
            values: [usuario, URL, descripcion, 0],
        };
        let results = await consultarDB(query);
        let post = results.rows[0];
        console.log(results.rows);
        return post
    } catch (error) {
        console.log('Error en la consulta a la base de datos', error);
        throw new Error("Error al intentar agregar un nuevo post.");
    }
};

const obtenerPosts = async () => {
    try {
        let query = "SELECT * FROM posts ORDER BY id";
        let results = await consultarDB(query);
        let posts = results.rows;
        //console.log(posts);
        return posts;
    } catch (error) {
        console.log(error);
        throw new Error("Error al traer los datos de los posts.");
    }
};

const editarLikes = async (id) => {
    try {
        const query = {
            text: "SELECT likes FROM posts SET WHERE id = $1",
            values: [id],
        };
        let results = await consultarDB(query);
        let totalLikes = results.rows[0].likes;
        //console.log(totalLikes);
        const actualizarLikes = {
            text: "UPDATE posts SET likes = $1 WHERE id = $2 RETURNING id, likes",
            values: [totalLikes + 1, id],
        };
        let likesActualizados = await consultarDB (actualizarLikes)
        let post = likesActualizados.rows[0]
        return post
    } catch (error) {
        console.log(error);
        throw new Error("Error al intentar actualizar los likes.");
    }
};

let operaciones = {
    consultarDB,
    nuevoPost,
    obtenerPosts,
    editarLikes
}

export default operaciones;