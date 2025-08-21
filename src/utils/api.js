import axios from 'axios';

const API_URL = 'https://api.skilla.ru';
// Замените токен на свой в .env (по желанию) или оставьте как было
const TOKEN = process.env.REACT_APP_SKILLA_TOKEN || 'testtoken';

/**
 * Получение списка звонков
 * params: { dateStart, dateEnd, callType, sortBy }
 */
export const getCallsList = async (params = {}) => {
  try {
    const response = await axios.post(
      `${API_URL}/mango/getList`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        params: {
          date_start: params.dateStart,
          date_end: params.dateEnd,
          in_out: params.callType !== 'all' ? params.callType : undefined,
          sort_by: params.sortBy,
        }
      }
    );
    return response.data.results || [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

/**
 * Получение записи разговора
 */
export const getCallRecord = async (recordId, partnershipId) => {
  try {
    const response = await axios.post(
      `${API_URL}/mango/getRecord`,
      null,
      {
        params: {
          record: recordId,
          partnership_id: partnershipId
        },
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
          'Content-Transfer-Encoding': 'binary',
          'Content-Disposition': 'filename="record.mp3"'
        },
        responseType: 'blob'
      }
    );
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Record fetch error:', error);
    return null;
  }
};
