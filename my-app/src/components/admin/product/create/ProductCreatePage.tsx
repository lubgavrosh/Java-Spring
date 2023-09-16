import { useNavigate } from "react-router-dom";
import { IProductCreate } from "./types";
import { useFormik } from "formik";
import http_common from "../../../../http_common.ts";
import { ChangeEvent, useEffect, useState } from "react";
import { IProductItem } from "../list/types.ts";
import * as Yup from "yup";

const ProductCreatePage = () => {
    const [products, setProducts] = useState<IProductItem[]>([]);

    useEffect(() => {
        http_common.get<IProductItem[]>("/api/products").then((resp) => {
            setProducts(resp.data);
        });
    }, []);

    const navigate = useNavigate();

    const initialValues: IProductCreate = {
        name: "",
        image: null,
        description: "",
        categoryId: 0,
    };

    const productSchema = Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .max(255, "Name must be smaller")
            .test("unique-category", "Category already exists", function (
                value
            ) {
                if (!value) {
                    return false;
                }
                const categoryExists = products.some(
                    (c) => c.name.toLowerCase() === value.toLowerCase()
                );
                return !categoryExists;
            }),
        description: Yup.string()
            .required("Description is required")
            .max(4000, "Description must be smaller"),
        image: Yup.array()
            .min(1, "At least one image is required")
            .test("image-type", "Only image files are allowed", function (value) {
                if (!value) return true;
                return value.every(
                    (file) =>
                        file.type === "image/jpeg" || file.type === "image/png"
                );
            }),
    });

    const onFormikSubmit = async (values: IProductCreate) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("categoryId", values.categoryId.toString());

            if (values.image) {
                for (let i = 0; i < values.image.length; i++) {
                    formData.append("image", values.image[i]);
                }
            }

            await http_common.post("/api/products", formData);
            navigate("/products");
        } catch {
            console.log("Server error");
        }
    };

    const formik = useFormik({
        initialValues,
        onSubmit: onFormikSubmit,
        validationSchema: productSchema,
    });

    const { values, errors, touched, handleChange, handleSubmit, setFieldValue, handleBlur } = formik;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files) {
            setFieldValue("image", Array.from(files));
        }
        e.target.value = "";
    };

    return (
        <>
            <div className="mx-auto text-center">
                <h1 className="text-3xl font-bold text-black sm:text-4xl">
                    Додати продукт
                </h1>
            </div>

            <form onSubmit={handleSubmit} className={"mt-4"}>
                <i
                    className="bi bi-arrow-left-circle-fill back-button"
                    onClick={() => navigate("..")}
                ></i>

                <div className="mb-6">
                    <input
                        onBlur={handleBlur}
                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                            errors.name && touched.name
                                ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400"
                                : ""
                        }`}
                        type="text"
                        placeholder="Name"
                        name="name"
                        aria-label="Name"
                        aria-describedby="basic-addon2"
                        onChange={handleChange}
                        value={values.name}
                    />
                    {errors.name && touched.name && (
                        <div className={"mt-2 text-sm text-red-600 dark:text-red-500"}>
                            {errors.name}
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <textarea
                        onBlur={handleBlur}
                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                            errors.description && touched.description
                                ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400"
                                : ""
                        }`}
                        placeholder="Description"
                        name="description"
                        aria-label="Description"
                        aria-describedby="basic-addon2"
                        onChange={handleChange}
                        value={values.description}
                    />
                    {errors.description && touched.description && (
                        <div className={"mt-2 text-sm text-red-600 dark:text-red-500"}>
                            {errors.description}
                        </div>
                    )}
                </div>

                <div className="mb-6 items-center justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 ${
                            errors.image && touched.image
                                ? "border-red-500 dark:border-red-400 bg-red-50"
                                : "dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        }`}
                    >
                        {values.image && values.image.length > 0 ? (
                            <div className="flex flex-wrap">
                                {values.image.map((file, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(file)}
                                        alt={`Selected ${index + 1}`}
                                        className="p-1 object-fill rounded-lg cursor-pointer m-2"
                                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or
                                    drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SVG, PNG, JPG
                                </p>
                            </div>
                        )}
                    </label>
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        name="image"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                    {errors.image && touched.image && (
                        <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                            {errors.image}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Create
                </button>
            </form>
        </>
    );
};

export default ProductCreatePage;
