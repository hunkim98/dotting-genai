import Image from "next/image";
import loading from "@/public/loading.svg";

const Loading = () => {
  return <Image src={loading} width={36} height={36} alt="loading..." />;
};

export default Loading;
