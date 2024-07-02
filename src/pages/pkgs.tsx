import { Layout } from '../components/Layout'
import { PkgList } from '../components/PkgList'

import { config, Pkg } from '../config'

export const PkgsPage = (props: { pkgs: Pkg[] }) => {
  return (
    <Layout title={config.url}>
      <PkgList pkgs={props.pkgs}/>
    </Layout>
  )
}
