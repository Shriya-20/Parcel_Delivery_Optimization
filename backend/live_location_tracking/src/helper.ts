import { Axios } from "axios";

const axios = new Axios({
  baseURL: process.env.MAIN_SERVER_BASE_URL,
});

export async function updateDriverLocation(driverId:string, latitude:number, longitude:number) {
  try {
    const body = {
        driverId,
        latitude,
        longitude
    }
    //for now only this we will keep basically all those battery level,speed,heading etc will be but main are these only
    const response = await axios.post(`/api/drivers/${driverId}/location`, body);

    if (response.status === 200) {
      // Successfully updated
      return response.data.data;
    } else {
      throw new Error("Failed to update driver location");
    }
  } catch (error) {
    console.error("Error updating driver location of driver with ID:", driverId, error);
    return null;
  }
}
