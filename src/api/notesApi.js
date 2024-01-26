import { backendApi } from './backendApi'
import { bearerAuth } from './bearerAuth'

const noteClient = backendApi('/api/v1/notes')

export const notesApi = {
  async getAllPublic(token) {
    try {
      const response = await noteClient.get('/public', {
        headers: {Authorization: bearerAuth(token)}
      });
      return response.data; // Return the JSON data from the response
    } catch (error) {
      console.error('Error fetching private notes:', error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  },


  async getAllPrivate(token) {
    try {
      const response = await noteClient.get('/private', {
        headers: {Authorization: bearerAuth(token)}
      });
      return response.data; // Return the JSON data from the response
    } catch (error) {
      console.error('Error fetching private notes:', error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  },

  async decrypt(id, password, token) {
    try {
      const response = await noteClient.post('/decrypt', { id, password }, {
        headers: { Authorization: bearerAuth(token) }
      });
      return response.data; // Return the JSON data from the response
    } catch (error) {
      console.error('Error fetching private notes:', error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  },

  async deleteNote(note, token) {
    try {

      console.log("request to delete: ");
      console.log(note);

      const response = await noteClient.delete(`/delete/${note}`, {
        headers: { Authorization: bearerAuth(token) }
      });

      return response.data; // Return the JSON data from the response
    } catch (error) {
      console.error('Error deleting private note:', error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  },


  async createNote(note, token) {
    try {
      console.log("request to delete: ");
      console.log(note);

      const response = await noteClient.post('/create', note, {
        headers: { Authorization: bearerAuth(token) }
      });

      return response.data; // Return the JSON data from the response
    } catch (error) {
      console.error('Error deleting private note:', error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  },

  update (note, token) {
    return noteClient.put(`/update`, note, {
      headers: { Authorization: bearerAuth(token) }
    })
  },

  delete (note, token) {
    console.log('Delete notes')
    return noteClient.delete(`/delete`, note, {
      headers: { Authorization: bearerAuth(token) }
    })
  }
}
