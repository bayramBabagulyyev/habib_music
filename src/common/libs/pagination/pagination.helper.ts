import { PaginationRequest } from './interfaces';
import { PaginationResponseDto } from './pagination-response.dto';

export class Pagination {
  /**
   * Return pagination response
   * @param PaginationRequest {PaginationRequest}
   * @param totalRecords {number}
   * @param dtos {t[]}
   * @returns {PaginationResponseDto}
   */
  static of<T, R>(
    { limit, page, skip }: PaginationRequest<T>,
    totalRecords: number,
    dtos: R[],
  ): PaginationResponseDto<R> {
    const totalPages =
      Math.floor(totalRecords / limit) + (totalRecords % limit > 0 ? 1 : 0);
    const currentPage = +page > 0 ? +page : 1;
    const hasNext = currentPage <= totalPages - 1;

    return {
      totalPages,
      payloadSize: dtos.length,
      hasNext,
      content: dtos,
      currentPage,
      skippedRecords: skip ? skip : null,
      totalRecords,
    };
  }
}
