import express from 'express';
import operaciones from './crud.js';

import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const log = console.log;
const port = 3000;

// MIDDLEWARES GENERALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DEJAR PÚBLICA LA CARPETA PUBLIC
app.use(express.static('public'));

//RUTA PÁGINA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.post('/post', async (req, res) => {
    try {
        const { usuario, URL, descripcion } = req.body;
        log(usuario, URL, descripcion)//body
        if (!usuario || !URL || !descripcion) {
            return res.status(400).json({
                message: 'Debe proporcionar todos los valores requeridos [usuario, URL, descripcion].'
            })
        }
        await operaciones.nuevoPost(usuario, URL, descripcion);
        res.status(201).json({
            message: 'Post agregada con éxito.'
        })
    } catch (error) {
        log('Error al agregar el post.', error)
        res.status(500).json({
            message: 'Error interno del servidor.'
        })
    }
});

app.put('/post', async (req, res) => {
    let id = req.query.id;
    try {
        const likesUpdated = await operaciones.editarLikes(id)
        if (likesUpdated) {
            res.status(200).send('Likes actualizados correctamente.');
        } else {
            res.status(404).send(`Error al actualizar los likes.`);
        }
    } catch (error) {
        log(error)
        res.status(500).send('Error interno del servidor al actualizar los likes.');
    }
});

app.get('/posts', async (req, res) => {
    try {
        let posts = await operaciones.obtenerPosts();
        res.status(200).json(posts)
    } catch (error) {
        log('Error al intentar obtener el listado de posts.', error)
        res.status(500).json({
            message: 'Error interno del servidor.'
        })
    }
});

app.all('*', (req, res) => {
    res.send('Página no encontrada.')
});

app.listen(port, () => {
    log(`Servidor ejecutándose en puerto ${port}.`)
});


