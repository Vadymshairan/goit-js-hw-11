import axios from 'axios';
export { fetchImg };

const key = '29712897-60ad4d69585ed3d08281554d0';
const url = `https://pixabay.com/api/?key=${key}`;

async function fetchImg(query, page, perPage) {
  return await axios.get(
    `${url}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
}
