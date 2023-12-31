import { ChangeEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IProductItem} from "../list/types.ts";
import {IProductCreate} from "./types.ts";
import { ICategoryItem } from "../../category/list/types";
import http_common from "../../../../http_common.ts";
import InputGroup from "../../../common/InputGroup.tsx";
import SelectGroup from "../../../common/SelectGroup.tsx";

const ProductCreatePage = () => {
    const navigator = useNavigate();

    const [model, setModel] = useState<IProductCreate>({
        name: "",
        description: "",
        images:[],
        price: 0,
        category_id: 1
    });

    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

    useEffect(() => {
        http_common
            .get<Array<ICategoryItem>>(`/category`)
            .then((resp) => {
                console.log("resp = ", resp);
                setCategories(resp.data);
            });
    }, []);



    const onChangeHandler= (e: ChangeEvent<HTMLInputElement>| ChangeEvent<HTMLTextAreaElement>| ChangeEvent<HTMLSelectElement>) => {
        setModel({...model, [e.target.name]: e.target.value});
    }

    const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const {target} = e;
        if(target.files) {
            const file = target.files[0];
            setModel({...model, images: [...model.images, file]});
        }
        target.value="";
    }

    const onSubmitHandler = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // console.log("Send Server form", model);
            const result = await http_common.post<IProductItem>(
                `api/products`, model,
                {
                    headers: {"Content-Type": "multipart/form-data"}
                });
            console.log("Result ", result);
            navigator("/");

        }catch(error: unknown) {     console.log("server error");}
    }

    const filesContent = model.images.map((f, index)=> (
        <div key={index} className="mb-4">
            <Link
                to="#"
                onClick={(e) => {
                    e.preventDefault();
                    setModel({ ...model, images: model.images.filter((x) => x !== f) });
                    console.log("click delete", f);
                }}
            >
                <FaTrash className="m-2 " />
            </Link>
            <div className="relative">
                <div style={{ height: "150px" }}>
                    <div className="picture-main">
                        <img
                            src={URL.createObjectURL(f)}
                            className="picture-container"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    ));

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <h1 className="font-medium text-3xl">Додати товар</h1>
            <form onSubmit={onSubmitHandler}>
                <div className="mt-8 grid lg:grid-cols-1 gap-4">

                    // Ваш компонент, де ви використовуєте InputGroup
                    <InputGroup
                        label={"Назва"}
                        value={model.name}
                        onChange={onChangeHandler}
                        field={"name"}
                        handleChange={onChangeHandler} // Передаємо тут
                        handleBlur={onChangeHandler}
                    />


                    <InputGroup
                        label={"Ціна"}
                        value={model.price}
                        onChange={onChangeHandler}
                        field={"price"}
                        type={"number"}
                        handleChange={onChangeHandler} // Передаємо тут
                        handleBlur={onChangeHandler}

                    />

                    <SelectGroup label={"Категорія"}
                                 field={"category_id"}
                                 onChange={onChangeHandler}
                                 items={categories} />

                    <div>
                        <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Опис
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={model.description}
                            onChange={onChangeHandler}
                            rows={4}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Вкажіть опис..."
                        ></textarea>
                    </div>

                    <div>

                        <div className="grid lg:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-2 items-center gap-4">
                            {filesContent}
                        </div>
                        <label className="block text-sm font-medium text-gray-700">
                            Фото
                        </label>




                        <div className="mt-1 flex items-center">
                            <label
                                htmlFor="selectImage"
                                className="ml-5 rounded-md border border-gray-300 bg-white
                        py-2 px-3 text-sm font-medium leading-4 text-gray-700
                        shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                        focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Обрати фото
                            </label>
                        </div>

                        <input
                            type="file"
                            id="selectImage"
                            className="hidden"
                            onChange={onFileChangeHandler}
                        />
                    </div>


                </div>
                <div className="space-x-4 mt-8">
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
                    >
                        Додати
                    </button>
                    <Link to="/" className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50">
                        Скасувати
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ProductCreatePage;