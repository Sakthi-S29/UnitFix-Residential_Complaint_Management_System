import raise from "../assets/features/raise.png";
import schedule from "../assets/features/schedule.png";
import upload from "../assets/features/upload.png";
import confirm from "../assets/features/confirm.png";
import manage from "../assets/features/manage.png";
import track from "../assets/features/track.png";
import reports from "../assets/features/reports.png";
import schedule2 from "../assets/features/schedule2.png";

const tenantFeatures = [
  { icon: raise, title: "Raise Complaints", desc: "Submit unit-specific issues in seconds." },
  { icon: schedule, title: "Schedule Repairs", desc: "Admins can assign repair tasks quickly." },
  { icon: upload, title: "Upload Images", desc: "Attach photos for better understanding." },
  { icon: confirm, title: "Dual Confirmation", desc: "Tenants and admins both confirm resolution." },
];

const adminFeatures = [
  { icon: manage, title: "Manage Units", desc: "View, onboard, or remove units from your property records." },
  { icon: schedule2, title: "Schedule Repairs", desc: "Assign repair dates and contractors with automated email notifications." },
  { icon: track, title: "Track Complaints", desc: "Monitor complaint lifecycle from submission to resolution." },
  { icon: reports, title: "Upload Reports", desc: "Upload and manage related documents or images for each complaint." },
];

const FeatureShowcase = () => {
  return (
    <>
      <div className="features-subsection">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">🔧 Why Use UnitFix?</h2>
        <div className="features-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tenantFeatures.map((f, idx) => (
            <div className="feature-card bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center hover:shadow-xl transition" key={`tenant-${idx}`}>
              <div className="feature-icon mb-3 flex justify-center">
                <img src={f.icon} alt={f.title} className="w-12 h-12 object-contain" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="features-subsection mt-12">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">🏢 Apartment Manager Dashboard</h2>
        <div className="features-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminFeatures.map((f, idx) => (
            <div className="feature-card bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center hover:shadow-xl transition" key={`admin-${idx}`}>
              <div className="feature-icon mb-3 flex justify-center">
                <img src={f.icon} alt={f.title} className="w-12 h-12 object-contain" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeatureShowcase;
