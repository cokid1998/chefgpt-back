export const getPaginationParams = (page: number, take: number) => {
  return {
    skip: (page - 1) * take,
    take,
  };
};

export const getPaginationResult = <T>(
  data: T[],
  totalCount: number,
  take: number,
) => {
  return { data, totalCount, totalPage: Math.ceil(totalCount / take) };
};
