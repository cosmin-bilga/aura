import { Helmet } from "react-helmet-async";
import Cgu from "../../components/mentions légales/cgu";
import Cgv from "../../components/mentions légales/cgv";

const Legal = () => {
  return (
    <>
      <Helmet>
        <title>Mentions légales & CGU – CGV | Aura Services</title>
        <meta
          name="description"
          content="Consultez les mentions légales, conditions générales d'utilisation (CGU) et conditions générales de vente (CGV) du site Aura Services."
        />
      </Helmet>

      <div>
        <Cgu />
        <Cgv />
      </div>
    </>
  );
};

export default Legal;
