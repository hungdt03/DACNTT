import { useEffect } from "react";

/**
 * Custom hook để cập nhật tiêu đề trang web.
 * @param title Tiêu đề muốn đặt cho trang.
 */
const useTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | LinkUp`;
  }, [title]);
};

export default useTitle;
