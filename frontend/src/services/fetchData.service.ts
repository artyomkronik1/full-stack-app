
import axios, { AxiosResponse } from 'axios';


const BASE_URL: string = 'https://full-stack-app-server.vercel.app:3001';

const FetchdataService = {
	async fetchData(urls: string[]) {
		try {
			const result = await axios.post(`${BASE_URL}/metadata/fetch`, { urls });
			if (result.data.success) {
				return result.data;
			} else {
				return result.data;
			}
		} catch (error) {
			console.error('Error fetch data:', error);
		}
	},


}


export default FetchdataService;
