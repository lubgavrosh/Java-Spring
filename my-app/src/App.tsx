import './App.css'
import {Route, Routes} from "react-router-dom";
import DefaultLayout from "./components/containers/default/DefaultLayout.tsx";
import CategoryListPage from "./components/admin/category/list/CategoryListPage.tsx";
import CategoryCreatePage from "./components/admin/category/create/CategoryCreatePage.tsx";
import CategoryEditPage from "./components/admin/category/edit/CategoryEditPage.tsx";
import ProductListPage from "./components/admin/product/list/ProductListPage.tsx";
import ProductCreatePage from "./components/admin/product/create/ProductCreatePage.tsx";
import HomePage from "./components/admin/home/HomePage.tsx";
import LoginPage from "./components/admin/auth/login/LoginPage.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path={"/"} element={<DefaultLayout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path={"category"}>
                        <Route index element={<CategoryListPage/>}/>
                        <Route path={"create"} element={<CategoryCreatePage/>}/>
                        <Route path={"edit/:id"} element={<CategoryEditPage/>}/>
                    </Route>
                    <Route path={"products"}>
                        <Route index element={<ProductListPage/>}/>
                        <Route path={"create"} element={<ProductCreatePage/>}/>
                   </Route>
                    <Route path={"login"} element={<LoginPage />}></Route>


                </Route>
            </Routes>

        </>
    )
}

export default App