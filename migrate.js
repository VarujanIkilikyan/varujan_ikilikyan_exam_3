import {UsersModel,FilmsModel} from './models/Index.model.js';


    (async () => {
    console.log('Running migration...');
    const modelsList = [UsersModel,FilmsModel];
        for (let model of modelsList){
           await model.sync({alter: true});
            console.log(`model->${ model.name}->synchronized`)
        }
    console.log('Migration finished successfully.');
})();

