/**
    @ ✨ Scrape Anime Lovers
    @ Base: Apk AnimeLovers V3
**/

const axios = require('axios');

class AnimeLovers {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://apps.animekita.org/api/v1.1.9',
            headers: {
                'user-agent': 'Dart/3.1 (dart:io)',
                'accept-encoding': 'gzip',
                'host': 'apps.animekita.org'
            }
        });
    }
    
    newUploads = async function (page = '1') {
        if (page && isNaN(page)) throw new Error('Invalid page input');
        
        const { data } = await this.client(`/baruupload.php?page=${page}`)
            .catch(error => {
                console.error(error.message);
                throw new Error('No result found');
            });
        
        return data;
    }
    
    movieList = async function () {
        const { data } = await this.client(`/movie.php`)
            .catch(error => {
                console.error(error.message);
                throw new Error('No result found');
            });
        
        return data;
    }
    
    schedule = async function () {
        const { data } = await this.client(`/jadwal.php`)
            .catch(error => {
                console.error(error.message);
                throw new Error('No result found');
            });
        
        return data;
    }
    
    animeList = async function () {
        const { data } = await this.client(`/anime-list.php`)
            .catch(error => {
                console.error(error.message);
                throw new Error('No result found');
            });
        
        return data;
    }
    
    genre = async function (genre, page = '1') {
        const _genre = ['action', 'adventure', 'comedy', 'demons', 'drama', 'ecchi', 'fantasy', 'game', 'harem', 'historical', 'horror', 'josei', 'magic', 'martial-arts', 'mecha', 'military', 'music', 'mystery', 'psychological', 'parody', 'police', 'romance', 'samurai', 'school', 'sci-fi', 'seinen', 'shoujo', 'shoujo-ai', 'shounen', 'slice-of-life', 'sports', 'space', 'super-power', 'supernatural', 'thriller', 'vampire', 'yaoi', 'yuri'];
        
        if (!_genre.includes(genre)) throw new Error(`List available genres: ${_genre.join(', ')}`);
        if (page && isNaN(page)) throw new Error('Invalid page input');
        
        const { data } = await this.client(`/genreseries.php?url=${genre}/&page=${page}`)
            .catch(error => {
                console.error(error.message);
                throw new Error('No result found');
            });
        
        return data;
    }
    
    search = async function (query) {
        if (!query) throw new Error('Query is required');
        
        const { data } = await this.client(`/search.php?keyword=${query}`)
            .catch(error => {
                console.error(error.message);
                throw new Error('No result found');
            });
        
        return data;
    }
    
    detail = async function (url) {
        if (!url) throw new Error('Url is required');
        
        const { data } = await this.client(`/series.php?url=${url}`)
            .catch(error => {
                console.error(error.message);
                throw new Error('No result found');
            });
        
        return data;
    }
    
    episode = async function (url, reso = '720p') {
        const _reso = ['320p', '480p', '720p', '1080p', '4K'];
        
        if (!url) throw new Error('Url is required');
        if (!_reso.includes(reso)) throw new Error(`List available resolutions: ${_reso.join(', ')}`);
        
        const { data } = await this.client(`/chapter.php?url=${url}&reso=${reso}`)
            .catch(error => {
                console.error(error.message);
                throw new Error('No result found');
            });
        
        return data;
    }
}

module.exports = new AnimeLovers();
