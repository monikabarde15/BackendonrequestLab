import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from "../MessagesList";

const API_BASE = "https://backend.onrequestlab.com/api/v1";

interface Instance {
  user_instance_id: string;
  instance_type: string;
  instance_ip: string;
  status: string;
  payment_id?: string;
  web_ssh_url?: string;
  instance_name?: string;
  userId?: string;
  rentDate?: string;
  dp_key?: string;
  secret_key?: string;
}

const LabManager: React.FC = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(false);
  const [launchingInstance, setLaunchingInstance] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"free" | "paid" | "">("");
  const [accessToken, setAccessToken] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showLaunchButton, setShowLaunchButton] = useState(false);

  const [viewModal, setViewModal] = useState<{ open: boolean; dp?: string; secret?: string }>({ open: false });
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; instanceId?: string }>({ open: false });
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const pageSize = 5;

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
    return "";
  };
  const userId = getCookie("user_id");

  useEffect(() => {
    const token = getCookie("access");
    setAccessToken(token || "");
  }, []);

  useEffect(() => {
    if (accessToken) fetchInstances();
  }, [accessToken]);

  const fetchInstances = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      let data = res.data || [];

      // 🔹 Sort: launched instances first
      data = data.sort((a: Instance, b: Instance) => {
        if (a.status === "Launched" && b.status !== "Launched") return -1;
        if (a.status !== "Launched" && b.status === "Launched") return 1;
        return 0;
      });

      setInstances(data);
    } catch (err: any) {
      console.error("Fetch instances error:", err.response || err);
      toast.error("Failed to fetch instances");
    } finally {
      setLoading(false);
    }
  };

  // Payment after redirect
  useEffect(() => {
    const paymentDone = localStorage.getItem("paymentSuccess");
    const selectedType = localStorage.getItem("selectedType");

    if (paymentDone && selectedType) {
      toast.success("Payment verified! You can now launch your instance.");
      setShowLaunchButton(true);
    }
  }, []);

  const handleLaunchAfterPayment = async () => {
    const type = localStorage.getItem("selectedType");
    if (!type) return toast.error("No instance type found");
    await launchInstance(type);
    localStorage.removeItem("paymentSuccess");
    localStorage.removeItem("selectedType");
    setShowLaunchButton(false);
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlanSelection = async (plan: "free" | "paid") => {
    if (!selectedType) {
      toast.error("Please select instance type first");
      return;
    }
    setSelectedPlan(plan);

    if (plan === "free") {
      await launchInstance(selectedType);
    } else {
      await payThenLaunch(selectedType, 100);
    }
  };

  const payThenLaunch = async (type: string, amount: number) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) return toast.error("Failed to load Razorpay");

    try {
      const orderRes = await axios.post(
        `${API_BASE}/users/create-order/`,
        { amount },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const options = {
        key: orderRes.data.key_id,
        order_id: orderRes.data.order_id,
        amount: amount * 100,
        name: "OnRequestLab",
        description: "Instance Payment",
        handler: async (response: any) => {
          try {
            const verify = await axios.post(
              `${API_BASE}/users/verify-payment/`,
              response,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (verify.data.success) {
              toast.success("Payment successful!");
              localStorage.setItem("paymentSuccess", "true");
              localStorage.setItem("selectedType", type);
              window.location.href = "/apps/LabListNormal";
            } else {
              toast.error("Payment verification failed");
            }
          } catch {
            toast.error("Error verifying payment");
          }
        },
        modal: { ondismiss: () => toast.warning("Payment cancelled") },
        prefill: { name: "User", email: "user@example.com" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Error creating Razorpay order");
    }
  };

  const launchInstance = async (type: string, payment_id?: string) => {
    setLaunchingInstance(true);
    try {
      await axios.post(
        `${API_BASE}/users/deploy-experimental/linux/`,
        { action: type, user_id: userId, payment_id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.info("Launching instance...");
      const interval = setInterval(async () => {
        const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const latest = res.data.find((i: Instance) => i.status === "Launched");
        if (latest) {
          clearInterval(interval);
          toast.success(`Instance launched at ${latest.instance_ip}`);
          setLaunchingInstance(false);
          fetchInstances();
        }
      }, 5000);
    } catch {
      toast.error("Instance launch failed");
      setLaunchingInstance(false);
    }
  };

  const destroyInstance = async (user_instance_id: string) => {
  if (!window.confirm("Are you sure to destroy this instance?")) return;

  try {
    setLaunchingInstance(true); // show loader
    await axios.post(
      `${API_BASE}/users/deploy/destroy/`,
      { user_id: user_instance_id },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Wait a bit to let backend actually terminate the instance
    const checkInterval = setInterval(async () => {
      const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const instanceStillExists = res.data.find(
        (i: Instance) => i.user_instance_id === user_instance_id && i.status !== "Terminated"
      );

      if (!instanceStillExists) {
        clearInterval(checkInterval);
        toast.success("Instance destroyed successfully!");
        fetchInstances();
        setLaunchingInstance(false); // hide loader
      }
    }, 2000);
  } catch {
    toast.error("Failed to destroy instance");
    setLaunchingInstance(false);
  }
};


  const rebootInstance = async (id: string) => {
    if (!window.confirm("Are you sure you want to reboot this instance?")) return;
    try {
      const token = (localStorage.getItem("jwt-auth") || "").trim();
      if (!token) return toast.error("No access token found. Please login again.");
      const csrfToken = getCookie("csrftoken");
      const res = await axios.post(
        `https://backend.onrequestlab.com/api/v1/users/reboot/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(csrfToken ? { "X-CSRFTOKEN": csrfToken } : {}),
            Accept: "application/json",
          },
        }
      );
      toast.success(res.data.message || "Reboot initiated!");
    } catch (err: any) {
      console.error("Reboot error:", err.response || err);
      toast.error("Failed to reboot instance");
    }
  };

  const sendFeedback = async () => {
    if (!feedbackSubject || !feedbackMessage) return toast.error("Fill all fields");
    try {
      const csrfToken = getCookie("csrftoken");
      await axios.post(
  "https://backend.onrequestlab.com/api/feedback/feedback_vc/",
  {
    user: userId,            // Add user ID
    description: feedbackMessage, // message goes here
    subject: feedbackSubject // optional if backend supports it
  },
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(csrfToken ? { "X-CSRFTOKEN": csrfToken } : {}),
    },
  }
);

      toast.success("Feedback sent!");
      setFeedbackModal({ open: false });
      setFeedbackSubject("");
      setFeedbackMessage("");
    } catch {
      toast.error("Failed to send feedback");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const filtered = instances.filter(
    (i) =>
      i.instance_type.toLowerCase().includes(search.toLowerCase()) ||
      i.status.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const displayed = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Lab Manager</h2>

      {/* Select / Pay Plan */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <select
          className="border px-2 py-1 rounded"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Select Instance Type</option>
          <option value="linux">Pacemaker ClusterLab</option>
          <option value="redhat">Iscsi Lab</option>
        </select>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
          onClick={() => handlePlanSelection("paid")}
        >
          Pay
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
          onClick={() => handlePlanSelection("free")}
        >
          Launch Free Instance
        </button>

        <input
          type="text"
          placeholder="Search by type/status..."
          className="border px-2 py-1 rounded ml-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 🔹 After Payment Success */}
      {showLaunchButton && (
        <div className="mb-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            onClick={handleLaunchAfterPayment}
          >
            Launch Instance (After Payment)
          </button>
        </div>
      )}

      {/* Table */}
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-3">ID</th>
            <th className="py-2 px-3">Type</th>
            <th className="py-2 px-3">IP</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : displayed.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No instances
              </td>
            </tr>
          ) : (
            displayed.map((i) => (
              <tr key={i.user_instance_id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-3">{i.user_instance_id}</td>
                <td className="py-2 px-3">{i.instance_type}</td>
                <td className="py-2 px-3">{i.instance_ip || "-"}</td>
                <td className="py-2 px-3">{i.status}</td>
                <td className="py-2 px-3 flex gap-2">
                  {i.web_ssh_url && (
                    <>
                      <button
                        className={`px-2 py-1 rounded text-white ${
                          i.status === "Terminated"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                        disabled={i.status === "Terminated"}
                        onClick={() =>
                          i.status !== "Terminated" && window.open(i.web_ssh_url, "_blank")
                        }
                      >
                        SSH
                      </button>
                      <button
                        className="px-2 py-1 rounded text-white bg-indigo-500 hover:bg-indigo-600"
                        onClick={() =>
                          setViewModal({ open: true, dp: i.AccessKeyId, secret: i.SecretAccessKey })
                        }
                      >
                        View
                      </button>
                    </>
                  )}
                  {i.status === "Launched" && (
                    <>
                      <button
                        className="px-2 py-1 rounded text-white bg-blue-500 hover:bg-blue-600"
                        onClick={() => rebootInstance(i.user_instance_id)}
                      >
                        Reboot
                      </button>
                      <button
                        className="px-2 py-1 rounded text-white bg-red-500 hover:bg-red-600"
                        onClick={() => destroyInstance(i.userId!)}
                      >
                        Destroy
                      </button>
                      <button
                        className="px-2 py-1 rounded text-white bg-purple-500 hover:bg-purple-600"
                        onClick={() => setFeedbackModal({ open: true, instanceId: i.user_instance_id })}
                      >
                        Feedback
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Loader */}
      {launchingInstance && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-white text-lg mt-4">Processing...</p>
        </div>
      )}

      {/* View Modal */}
      {viewModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded p-6 w-full max-w-2xl max-h-[80vh] relative overflow-y-auto">
    <h3 className="text-lg font-semibold mb-4">Instance Keys</h3>

    <div className="mb-2 flex justify-between items-center break-all">
      <span className="font-semibold">DP Key:</span>
      <div className="flex gap-2 flex-1 ml-2">
        <span className="font-mono truncate">{viewModal.dp || "-"}</span>
        {viewModal.dp && (
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => copyToClipboard(viewModal.dp!)}
          >
            Copy
          </button>
        )}
      </div>
    </div>

    <div className="mb-4 flex justify-between items-center break-all">
      <span className="font-semibold">Secret Key:</span>
      <div className="flex gap-2 flex-1 ml-2">
        <span className="font-mono truncate">{viewModal.secret || "-"}</span>
        {viewModal.secret && (
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => copyToClipboard(viewModal.secret!)}
          >
            Copy
          </button>
        )}
      </div>
    </div>

    <button
      className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
      onClick={() => setViewModal({ open: false })}
    >
      X
    </button>
  </div>
</div>


      )}

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-96 relative">
            <h3 className="text-lg font-semibold mb-4">Send Feedback</h3>
            <input
              type="text"
              placeholder="Subject"
              className="border px-2 py-1 w-full mb-2 rounded"
              value={feedbackSubject}
              onChange={(e) => setFeedbackSubject(e.target.value)}
            />
            <textarea
              placeholder="Message"
              className="border px-2 py-1 w-full mb-2 rounded"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setFeedbackModal({ open: false })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={sendFeedback}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <Message />
    </div>
  );
};

export default LabManager;
