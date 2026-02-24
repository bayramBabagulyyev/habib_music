import { AlbumModel, AudioModel, ReelsModel, VideoModel } from '@db/models';
import { Inject, Injectable } from '@nestjs/common';
import { Sequelize, col, fn, literal } from 'sequelize';
import { QueryStatisticsDto } from './dto/query-statistics.dto';

@Injectable()
export class StatisticsService {
    constructor(
        @Inject('AUDIO')
        private readonly audio: typeof AudioModel,
        @Inject('VIDEO')
        private readonly video: typeof VideoModel,
        @Inject('ALBUM')
        private readonly album: typeof AlbumModel,
        @Inject('REELS')
        private readonly reels: typeof ReelsModel,
        @Inject('SEQUELIZE')
        private readonly sequelize: Sequelize,
    ) { }

    async getOverview(query: QueryStatisticsDto) {
        const [audioStats, videoStats, reelsStats] = await Promise.all([
            this.audio.findOne({
                attributes: [
                    [fn('COALESCE', fn('SUM', col('listenCount')), 0), 'totalListens'],
                    [fn('COALESCE', fn('SUM', col('downloadCount')), 0), 'totalDownloads'],
                    [fn('COALESCE', fn('SUM', col('likeCount')), 0), 'totalLikes'],
                    [fn('COALESCE', fn('SUM', col('shareCount')), 0), 'totalShares'],
                    [fn('COUNT', col('id')), 'totalCount'],
                ],
                raw: true,
            }),
            this.video.findOne({
                attributes: [
                    [fn('COALESCE', fn('SUM', col('listenCount')), 0), 'totalListens'],
                    [fn('COALESCE', fn('SUM', col('downloadCount')), 0), 'totalDownloads'],
                    [fn('COALESCE', fn('SUM', col('likeCount')), 0), 'totalLikes'],
                    [fn('COALESCE', fn('SUM', col('shareCount')), 0), 'totalShares'],
                    [fn('COUNT', col('id')), 'totalCount'],
                ],
                raw: true,
            }),
            this.reels.findOne({
                attributes: [
                    [fn('COALESCE', fn('SUM', col('listenCount')), 0), 'totalListens'],
                    [fn('COALESCE', fn('SUM', col('downloadCount')), 0), 'totalDownloads'],
                    [fn('COALESCE', fn('SUM', col('likeCount')), 0), 'totalLikes'],
                    [fn('COALESCE', fn('SUM', col('shareCount')), 0), 'totalShares'],
                    [fn('COUNT', col('id')), 'totalCount'],
                ],
                raw: true,
            }),
        ]);

        const albumCount = await this.album.count();

        const audio: any = audioStats || {};
        const video: any = videoStats || {};
        const reel: any = reelsStats || {};

        const totalListens = Number(audio.totalListens || 0) + Number(video.totalListens || 0) + Number(reel.totalListens || 0);
        const totalDownloads = Number(audio.totalDownloads || 0) + Number(video.totalDownloads || 0) + Number(reel.totalDownloads || 0);
        const totalLikes = Number(audio.totalLikes || 0) + Number(video.totalLikes || 0) + Number(reel.totalLikes || 0);
        const totalShares = Number(audio.totalShares || 0) + Number(video.totalShares || 0) + Number(reel.totalShares || 0);

        return {
            // Top summary cards (Diňleýjiler, Ýükläp alanlar, Halananlar, Paýlaşanlar)
            summary: {
                listeners: totalListens,
                downloads: totalDownloads,
                likes: totalLikes,
                shares: totalShares,
            },
            // Content counts (Aýdymlar, Klipler, Albomlar, Reals)
            content: {
                audios: Number(audio.totalCount || 0),
                videos: Number(video.totalCount || 0),
                albums: albumCount,
                reels: Number(reel.totalCount || 0),
            },
        };
    }

    async getMonthlyListeners(query: QueryStatisticsDto) {
        const year = query.startDate
            ? new Date(query.startDate).getFullYear()
            : new Date().getFullYear();

        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        // Get monthly listener data from audios created in each month
        const [audioMonthly, videoMonthly, reelsMonthly] = await Promise.all([
            this.audio.findAll({
                attributes: [
                    [fn('EXTRACT', literal("MONTH FROM \"AudioModel\".\"createdAt\"")), 'month'],
                    [fn('COALESCE', fn('SUM', col('listenCount')), 0), 'listens'],
                ],
                where: literal(`"AudioModel"."createdAt" BETWEEN '${startDate}' AND '${endDate}'`),
                group: [fn('EXTRACT', literal('MONTH FROM "AudioModel"."createdAt"'))],
                raw: true,
            }),
            this.video.findAll({
                attributes: [
                    [fn('EXTRACT', literal("MONTH FROM \"VideoModel\".\"createdAt\"")), 'month'],
                    [fn('COALESCE', fn('SUM', col('listenCount')), 0), 'listens'],
                ],
                where: literal(`"VideoModel"."createdAt" BETWEEN '${startDate}' AND '${endDate}'`),
                group: [fn('EXTRACT', literal('MONTH FROM "VideoModel"."createdAt"'))],
                raw: true,
            }),
            this.reels.findAll({
                attributes: [
                    [fn('EXTRACT', literal("MONTH FROM \"ReelsModel\".\"createdAt\"")), 'month'],
                    [fn('COALESCE', fn('SUM', col('listenCount')), 0), 'listens'],
                ],
                where: literal(`"ReelsModel"."createdAt" BETWEEN '${startDate}' AND '${endDate}'`),
                group: [fn('EXTRACT', literal('MONTH FROM "ReelsModel"."createdAt"'))],
                raw: true,
            }),
        ]);

        // Merge monthly data into a 12-month array
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];

        const monthlyData = months.map((name, index) => {
            const monthNum = index + 1;
            const audioData: any = (audioMonthly as any[]).find((m: any) => Number(m.month) === monthNum);
            const videoData: any = (videoMonthly as any[]).find((m: any) => Number(m.month) === monthNum);
            const reelsData: any = (reelsMonthly as any[]).find((m: any) => Number(m.month) === monthNum);

            return {
                month: name,
                listeners:
                    Number(audioData?.listens || 0) +
                    Number(videoData?.listens || 0) +
                    Number(reelsData?.listens || 0),
            };
        });

        return {
            year,
            data: monthlyData,
        };
    }

    async getFullStatistics(query: QueryStatisticsDto) {
        const [overview, monthlyListeners] = await Promise.all([
            this.getOverview(query),
            this.getMonthlyListeners(query),
        ]);

        return {
            ...overview,
            chart: monthlyListeners,
        };
    }
}
