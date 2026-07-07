import { BrowserRouter, Routes, Route } from "react-router"
import { Layout } from "./components/layout/Layout"
import { DocsLayout } from "./components/docs/DocsLayout"
import { LandingPage } from "./pages/LandingPage"
import { RegistryPage } from "./pages/RegistryPage"
import { FaucetPage } from "./pages/FaucetPage"
import { WrapPage } from "./pages/WrapPage"
import { UnwrapPage } from "./pages/UnwrapPage"
import { AssetsPage } from "./pages/AssetsPage"
import { DocsPage } from "./pages/DocsPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<RegistryPage />} />
          <Route path="/registry" element={<RegistryPage />} />
          <Route path="/faucet" element={<FaucetPage />} />
          <Route path="/wrap" element={<WrapPage />} />
          <Route path="/unwrap" element={<UnwrapPage />} />
          <Route path="/assets" element={<AssetsPage />} />
        </Route>
        <Route element={<DocsLayout />}>
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/docs/:slug" element={<DocsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
