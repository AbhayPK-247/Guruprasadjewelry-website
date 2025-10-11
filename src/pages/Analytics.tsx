import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Card = ({ title, value, color = '#2563eb' }) => (
  <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center border border-gray-100">
    <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">{title}</div>
    <div className="text-3xl font-bold" style={{ color }}>{value}</div>
  </div>
);

const Analytics = () => {
  const { isAdmin, loading } = useAdmin();
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const { data: cartData } = await supabase.rpc('get_cart_analytics', {});
        const { data: favoritesData } = await supabase.rpc('get_favorites_analytics', {});

        // Gather all unique product ids
        const productIds = [
          ...new Set([
            ...(cartData?.map((item: any) => item.product_id) || []),
            ...(favoritesData?.map((item: any) => item.product_id) || []),
          ]),
        ];

        // Fetch product names
        const { data: productsData } = await supabase
          .from('jewellery_items')
          .select('id, name')
          .in('id', productIds);

        const productMap = new Map();
        productsData?.forEach((product: any) => {
          productMap.set(product.id, product.name);
        });

        const cartChartData = cartData?.map((item: any) => ({
          name: productMap.get(item.product_id) || (typeof item.product_id === 'string' ? item.product_id?.slice(0, 6) : item.product_id),
          cartCount: Number(item.count) || 0,
        }));

        const favoritesChartData = favoritesData?.map((item: any) => ({
          name: productMap.get(item.product_id) || (typeof item.product_id === 'string' ? item.product_id?.slice(0, 6) : item.product_id),
          favoritesCount: Number(item.count) || 0,
        }));

        setAnalyticsData({
          cart: cartData,
          favorites: favoritesData,
          productMap,
          cartChartData,
          favoritesChartData,
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (!isAdmin) return <div className="flex justify-center items-center h-full">You are not authorized to view this page.</div>;

  // Quick metrics totals
  const totalCart = analyticsData?.cart?.reduce((acc: number, it: any) => acc + Number(it.count), 0) || 0;
  const totalFav = analyticsData?.favorites?.reduce((acc: number, it: any) => acc + Number(it.count), 0) || 0;
  const uniqueProducts = new Set([
    ...(analyticsData?.cart?.map((it: any) => it.product_id) || []),
    ...(analyticsData?.favorites?.map((it: any) => it.product_id) || []),
  ]).size;

  return (
    <div className="container max-w-5xl mx-auto my-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Product Analytics Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-5 mb-10">
        <Card title="Total Added to Cart" value={totalCart} color="#2563eb" />
        <Card title="Total Favorited" value={totalFav} color="#f59e42" />
        <Card title="Unique Products Indexed" value={uniqueProducts} color="#48bb78" />
      </div>

      <div className="bg-white rounded-xl shadow-lg mb-10 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Added to Cart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={analyticsData?.cartChartData}
            margin={{ top: 8, right: 24, left: 8, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cartCount" fill="#2563eb" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg mb-10 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Added to Favorites</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={analyticsData?.favoritesChartData}
            margin={{ top: 8, right: 24, left: 8, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="favoritesCount" fill="#f59e42" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-3">Cart Analytics Table</h2>
          <div className="overflow-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left bg-gray-50">Product Name</th>
                  <th className="py-2 px-4 border-b text-left bg-gray-50">Added to Cart Count</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.cart?.map((item: any) => (
                  <tr key={item.product_id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">{analyticsData.productMap.get(item.product_id) || item.product_id}</td>
                    <td className="py-2 px-4">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Favorites Analytics Table</h2>
          <div className="overflow-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left bg-gray-50">Product Name</th>
                  <th className="py-2 px-4 border-b text-left bg-gray-50">Added to Favorites Count</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.favorites?.map((item: any) => (
                  <tr key={item.product_id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">{analyticsData.productMap.get(item.product_id) || item.product_id}</td>
                    <td className="py-2 px-4">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
