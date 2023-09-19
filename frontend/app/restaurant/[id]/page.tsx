import DetailRestaurant from "@/components/DetailRestaurant";

const page = ({ params }: { params: { id: string } }) => {
  return <DetailRestaurant restaurantId={params.id} />;
};

export default page;
