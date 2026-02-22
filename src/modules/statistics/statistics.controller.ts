import { TOKEN_NAME } from '@modules/auth';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryStatisticsDto } from './dto/query-statistics.dto';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
@ApiBearerAuth(TOKEN_NAME)
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) { }

    @Get()
    @ApiOperation({ summary: 'Get full statistics (overview + monthly chart)' })
    getFullStatistics(@Query() query: QueryStatisticsDto) {
        return this.statisticsService.getFullStatistics(query);
    }

    @Get('overview')
    @ApiOperation({ summary: 'Get overview statistics (summary + content counts)' })
    getOverview(@Query() query: QueryStatisticsDto) {
        return this.statisticsService.getOverview(query);
    }

    @Get('monthly-listeners')
    @ApiOperation({ summary: 'Get monthly listener chart data' })
    getMonthlyListeners(@Query() query: QueryStatisticsDto) {
        return this.statisticsService.getMonthlyListeners(query);
    }
}
