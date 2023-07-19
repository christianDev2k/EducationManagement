import event from '../../app/controllers/events.js';
import { GetLocalStorages } from '../../app/controllers/functions.js';

const app = () => {
    GetLocalStorages();
    event();
};

app();
