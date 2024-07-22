export const getById = <T extends Element>(id: string): T => {
  return document.querySelector(`[data-id='${id}']`) as T;
};

export const getByIdAll = <T extends Element>(id: string): T[] => {
  return document.querySelectorAll(`[data-id='${id}']`) as unknown as T[];
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isJson = (...itemList: unknown[]): boolean => {
  try {
    for (const item of itemList) {
      if (typeof item === `string`) {
        JSON.parse(item);
      } else {
        return false;
      }
    }
  } catch {
    return false;
  }
  return true;
};

export default {
  getById,
  getByIdAll,
  sleep,
  isJson,
};
