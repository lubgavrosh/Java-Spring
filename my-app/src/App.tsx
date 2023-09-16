import './App.css'
import {Route, Routes} from "react-router-dom";
import DefaultLayout from "./components/containers/default/DefaultLayout.tsx";
import CategoryListPage from "./components/admin/category/list/CategoryListPage.tsx";
import CategoryCreatePage from "./components/admin/category/create/CategoryCreatePage.tsx";
import CategoryEditPage from "./components/admin/category/edit/CategoryEditPage.tsx";
import ProductListPage from "./components/admin/product/list/ProductListPage.tsx";
import ProductCreatePage from "./components/admin/product/create/ProductCreatePage.tsx";
import HomePage from "./components/admin/home/HomePage.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/home" element={<DefaultLayout/>}>
                    <Route index element={<HomePage/>}/>
                </Route>




           <Route path="/category" element={<DefaultLayout/>}>
                <Route index element={<CategoryListPage/>}/>
                <Route path={"create"} element={<CategoryCreatePage/>}/>
               <Route path={"edit/:id"} element={<CategoryEditPage/>}/>
            </Route>


                <Route path="/products" element={<DefaultLayout/>}>
                    <Route index element={<ProductListPage/>}/>
                    <Route path={"create"} element={<ProductCreatePage/>}/>


                </Route>
            </Routes>

        </>
    )
}

export default App