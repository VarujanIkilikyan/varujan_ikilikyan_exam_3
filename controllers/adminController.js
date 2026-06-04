import HttpErrors from 'http-errors';
import {FilmsModel} from '../models/Index.model.js';


export default {

    async addFilm(req, res, next) {
        try {
            const {title, description, genre, duration} = req.body;



            const Film = await FilmsModel.create(
                {title, description, genre, duration})


            res.json({
                message: 'film created successfully',
                Film
            })
        } catch (e) {
            next(e);
        }
    },
    async updateFilm(req, res, next) {
        try {
            const {title, description, genre, duration} = req.body;
            const id =req.params.id;

           const movie = await  FilmsModel.findByPk(id);
           if(!movie){
               throw new HttpErrors(400, {
                   message: 'movie not found',
               })
           }
           const oldFilmData = movie.toJSON()

            const updateData = {};
            if (title !== undefined && title !== null) updateData.title = title;
            if (description !== undefined && description !== null) updateData.description = description;
            if (genre !== undefined && genre !== null) updateData.genre = genre;
            if (duration !== undefined && duration !== null) updateData.duration = duration;

            await movie.update(updateData)
            await movie.reload();
            const newFilmData = movie.toJSON()


            res.json({
                message: 'film Update successfully',
                oldFilmData,
                newFilmData
            })
        } catch (e) {
            next(e);
        }
    },

     async deleteFilm(req, res, next) {
        try {
            const id = req.params.id;
            const movie = await FilmsModel.findByPk(id);
            if(!movie){
                throw new HttpErrors(400, {
                    message: 'movie not found',
                })
            }
            const deletedMovie = movie.toJSON()
            await movie.destroy()

            res.json({
                message: 'deleted movie',
                Film: deletedMovie,
            })

        }catch (e) {
            next(e);
        }
    }

}