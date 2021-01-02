import axios from 'axios';

const instance = axios.create({
    baseURL:'http://localhost:5001/challenge-e0e5e/us-central1/api' //The api url(cloud function)
});

export default instance 