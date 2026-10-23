export const getPagination = (query = {}) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page < 1) {
    page = 1;
  }

  if (isNaN(limit) || limit < 1) {
    limit = 24;
  } else if (limit > 100) {
    limit = 100;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};