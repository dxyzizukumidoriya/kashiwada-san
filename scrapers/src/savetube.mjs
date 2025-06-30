import axios from 'axios';
import crypto from 'crypto';

const savetube = async (url, format = 'mp3') => {
  const id = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
  if (!id) return { status: false, error: 'Invalid YouTube URL' };

  const secretKey = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex');

  const supportedAudioFormats = ['mp3', '32', '48', '64', '128', '160', '320'];
  const supportedVideoFormats = ['144', '240', '360', '480', '720', '1080', '1440', '2160', '4320'];

  const isAudio = supportedAudioFormats.includes(format);
  const isVideo = supportedVideoFormats.includes(format);
  const quality = isAudio ? (format === 'mp3' ? '128' : format) : (isVideo ? format : null);

  if (!quality) {
    return {
      status: false,
      error:
        `Format tidak didukung.\n\nAudio: ${supportedAudioFormats.join(', ')}\nVideo: ${supportedVideoFormats.join(', ')}`
    };
  }

  const headers = {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  };

  const req = async (url, data = {}, method = 'post') => {
    const res = await axios({ method, url, data, headers });
    return res.data;
  };

  const cdn = (await req('https://media.savetube.me/api/random-cdn', {}, 'get')).cdn;
  const infoEnc = (await req(`https://${cdn}/v2/info`, {
    url: `https://www.youtube.com/watch?v=${id}`
  })).data;

  const buf = Buffer.from(infoEnc, 'base64');
  const iv = buf.slice(0, 16);
  const content = buf.slice(16);
  const decipher = crypto.createDecipheriv('aes-128-cbc', secretKey, iv);
  const json = JSON.parse(Buffer.concat([decipher.update(content), decipher.final()]).toString());

  const dl = await req(`https://${cdn}/download`, {
    id,
    downloadType: isAudio ? 'audio' : 'video',
    quality,
    key: json.key
  });

  return {
    status: true,
    title: json.title,
    thumbnail: json.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    duration: json.duration,
    format,
    quality,
    type: isAudio ? 'audio' : 'video',
    download: dl.data.downloadUrl
  };
};

// Contoh:
export default savetube;
