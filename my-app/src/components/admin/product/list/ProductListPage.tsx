import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http_common from "../../../../http_common";
import ModalDelete from "../../../common/ModalDelete";
import { IProductItem, IImagesItem } from "./types";

const ProductListPage = () => {
    const [list, setList] = useState<IProductItem[]>([]);

    const getData = () => {
        http_common
            .get<IProductItem[]>("/api/products")
            .then(resp => {
                setList(resp.data);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await http_common.delete(`/api/products/${id}`);
            getData();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const renderImages = (images: IImagesItem[]) => {
        return (
            <div className="flex flex-wrap">
                {images.map((image, index) => (
                    <img
                        key={index}
                        className="large m-2"
                        src={`http://localhost:8081/images/150_${image.image}`}
                        alt={`Product Image ${index}`}
                    />
                ))}
            </div>
        );
    };

    const content = list.map(item => (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
            <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
                {item.name}
            </th>
            <td className="px-6 py-4">{item.description}</td>
            <td className="px-6 py-4">{renderImages(item.images)}</td>
            <td className="px-6 py-4">
                <Link
                    to={`edit/${item.id}`}
                    className="mr-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                >
                    Змінить
                </Link>
                <ModalDelete id={item.id} text={item.name} deleteFunc={handleDelete}></ModalDelete>
            </td>
        </tr>
    ));

    return (
        <>
            <div className="mx-auto max-w-2xl lg:text-center">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Список продуктів
                </h1>
            </div>

            <div className="mt-6 relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Назва
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Опис
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Фото
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Дії
                        </th>
                    </tr>
                    </thead>
                    <tbody>{content}</tbody>
                </table>
            </div>
            <div className="mx-auto max-w-2xl lg:text-4xl lg:text-end">
                <Link
                    to="create"
                    className="mb-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Create New Product
                </Link>
            </div>
        </>
    );
}

export default ProductListPage;
