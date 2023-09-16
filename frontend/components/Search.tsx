export default function Search({ setQuery }: any) {
  return (
    <input
      className="appearance-none block w-full p-3 leading-5 text-coolGray-900 border border-coolGray-200 rounded-lg shadow-md placeholder-coolGray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      type="text"
      placeholder="Search restaurants"
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
