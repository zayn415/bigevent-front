
import request from "@/utils/request.js";

export const categoryListService = () => {
	return request.get("/category/list");
}

export const categoryAddService = (data) => {
	return request.post("/category/add", data);
}

export const categoryUpdateService = (data) => {
	return request.put("/category/update", data);
}

export const categoryDeleteService = (id) => {
	return request.delete('category/delete?id=' + id);
}