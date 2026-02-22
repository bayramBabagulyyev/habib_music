import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { statisticsProvider } from './providers/statistics.provider';
import { DatabaseModule } from '@db/sequelize-conf';

@Module({
    imports: [DatabaseModule],
    controllers: [StatisticsController],
    providers: [StatisticsService, ...statisticsProvider],
})
export class StatisticsModule { }
