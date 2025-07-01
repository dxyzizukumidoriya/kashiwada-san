import axios from 'axios';
const apiKey = 'AIzaSyALZVNFzWJVmcBJxRHMbiKvExzzS_DV694';

async function googleYoutube(url) {
    const result = {};
    try {
        const formatSubscriberCount = subscriberCount => {
            const count = parseInt(subscriberCount);
            if (count >= 1_000_000_000) {
                return (count / 1_000_000_000).toFixed(1).replace('.0', '') + 'B';
            } else if (count >= 1_000_000) {
                return (count / 1_000_000).toFixed(1).replace('.0', '') + 'M';
            } else if (count >= 1_000) {
                return (count / 1_000).toFixed(1).replace('.0', '') + 'K';
            } else {
                return count.toString();
            }
        };

        const formatRelativeTime = publishedAt => {
            const now = new Date();
            const publishedDate = new Date(publishedAt);
            const diffInMs = now - publishedDate;
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            const diffInMonths = Math.floor(diffInDays / 30);
            const diffInYears = Math.floor(diffInDays / 365);

            if (diffInYears >= 1) {
                return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
            } else if (diffInMonths >= 1) {
                return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
            } else {
                return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
            }
        };

        const formatDuration = duration => {
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            const hours = match[1] ? parseInt(match[1]) : 0;
            const minutes = match[2] ? parseInt(match[2]) : 0;
            const seconds = match[3] ? parseInt(match[3]) : 0;

            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        };

        const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?![^\s]*\?is=)/;
        const match = url.match(regex);
        const videoId = match[1];

        const videoResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&fields=items(id,snippet(title,description,publishedAt,channelId,channelTitle),statistics(likeCount,commentCount,viewCount),contentDetails(duration))&id=${videoId}&key=${apiKey}`
        );

        const videoData = videoResponse.data.items[0];
        const channelResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${videoData.snippet.channelId}&key=${apiKey}`
        );

        const channelData = channelResponse.data.items[0];

        return {
            title: videoData.snippet.title,
            description: videoData.snippet.description,
            videoId: videoData.id,
            thumbnail: `https://i.ytimg.com/vi/${videoData.id}/hqdefault.jpg`,
            metadata: {
                like: await formatSubscriberCount(videoData.statistics.likeCount),
                comment: await formatSubscriberCount(videoData.statistics.commentCount),
                view: await formatSubscriberCount(videoData.statistics.viewCount),
                duration: formatDuration(videoData.contentDetails.duration),
                ago: await formatRelativeTime(videoData.snippet.publishedAt),
                jadwal_upload: new Date(videoData.snippet.publishedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }),
            },
            author: {
                channelTitle: videoData.snippet.channelTitle,
                channelId: videoData.snippet.channelId,
                channelLink: `https://www.youtube.com/channel/${videoData.snippet.channelId}`,
                Subscribe: await formatSubscriberCount(channelData.statistics.subscriberCount),
                Tentang: channelData.snippet.description,
                ago: await formatRelativeTime(channelData.snippet.publishedAt),
                Bergabung: new Date(channelData.snippet.publishedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }),
            },
            url: `https://www.youtube.com/watch?v=${videoData.id}`,
        };
    } catch (e) {
        console.log('Error:', e);
        return result;
    }
}

export default googleYoutube;
