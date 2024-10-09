import region from '../assets/region.svg';
import visualise from '../assets/visualise.svg';
import charts from '../assets/charts.svg';
import progress from '../assets/progress.svg';

export default function Login() {
  const features = [
    {
      icon: region,
      title: "Region-wise Breakdown",
      description: "Our platform provides a comprehensive region-wise breakdown of Azure consumption, allowing you to easily track and analyze your cloud usage across different geographical areas.",
      align: "left",
      textColor: "text-[#9C2E2D]",
    },
    {
      icon: visualise,
      title: "Visualize Top Consumers",
      description: "Utilize our application to identify and analyze the biggest consumers of Azure services. This feature helps you pinpoint areas of high usage and optimize your cloud resources effectively.",
      align: "right",
      textColor: "text-[#1D4568]",
    },
    {
      icon: progress,
      title: "Consumption Trends",
      description: "Track the movement of a specific company's consumption over time with our intuitive visualization tools. This feature enables you to monitor progress, identify patterns, and make data-driven decisions.",
      align: "left",
      textColor: "text-[#9C2E2D]",
    },
    {
      icon: charts,
      title: "User-Friendly Analysis",
      description: "Our application's UI is designed to make consumption analysis easier and more convenient. With clear, interactive charts and graphs, you can quickly gain insights into your Azure usage and costs.",
      align: "right",
      textColor: "text-[#1D4568]",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Azure Consumption Portal
        </h2>
        <div className="space-y-16">
          {features.map((feature, index) => (
            <div key={index} className={`flex items-center ${feature.align === 'right' ? 'flex-row-reverse' : ''}`}>
              <div className="w-1/2 p-4">
                <img src={feature.icon} alt={feature.title} className="w-full h-auto max-h-64 object-contain" />
              </div>
              <div className="w-1/2 p-4">
                <h3 className={`text-2xl font-bold mb-4 ${feature.textColor}`}>{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}