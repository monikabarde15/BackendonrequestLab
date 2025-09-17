import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconX from '../../../components/Icon/IconX';
import IconDownload from '../../../components/Icon/IconDownload';
import IconEye from '../../../components/Icon/IconEye';
import IconSend from '../../../components/Icon/IconSend';
import IconSave from '../../../components/Icon/IconSave';
import axios from 'axios';

interface EmployeeForm {
  employeeNumber: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  name: string;
  mobileNumber: string;
  gender: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  maritalStatus: string;

  currentAddressLine1: string;
  currentCity: string;
  currentDistrict: string;
  currentState: string;
  currentPostalCode: string;
  currentCountry: string;
  currentLandmark: string;

  permanentAddressLine1: string;
  permanentCity: string;
  permanentDistrict: string;
  permanentState: string;
  permanentPostalCode: string;
  permanentCountry: string;
  permanentLandmark: string;

  aadharNumber: string;
  panNumber: string;
  pfAccount: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;

  basic: number;
  hra: number;
  sa: number;
  pt: number;
  pfEc: number;
  tds: number;

  notes: string;
  currency: string;
  tax: number;
  deduction: number;
  salary: number;
  companyLogo?: File | null;
  aadharFile?: File | null;
  panFile?: File | null;
}

const Edit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [form, setForm] = useState<EmployeeForm>({
    employeeNumber: '',
    department: '',
    designation: '',
    dateOfJoining: '',
    name: '',
    mobileNumber: '',
    gender: '',
    fatherName: '',
    motherName: '',
    contactNumber: '',
    maritalStatus: '',

    currentAddressLine1: '',
    currentCity: '',
    currentDistrict: '',
    currentState: '',
    currentPostalCode: '',
    currentCountry: '',
    currentLandmark: '',

    permanentAddressLine1: '',
    permanentCity: '',
    permanentDistrict: '',
    permanentState: '',
    permanentPostalCode: '',
    permanentCountry: '',
    permanentLandmark: '',

    aadharNumber: '',
    panNumber: '',
    pfAccount: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',

    basic: 0,
    hra: 0,
    sa: 0,
    pt: 0,
    pfEc: 0,
    tds: 0,

    notes: '',
    currency: 'USD - US Dollar',
    tax: 0,
    deduction: 0,
    salary: 0,

    companyLogo: null,
    aadharFile: null,
    panFile: null,
  });

  const [logoPreview, setLogoPreview] = useState<string>('');

  const currencyList = [
    'USD - US Dollar',
    'GBP - British Pound',
    'IDR - Indonesian Rupiah',
    'INR - Indian Rupee',
    'BRL - Brazilian Real',
    'EUR - Germany (Euro)',
    'TRY - Turkish Lira',
  ];

  const currencySymbols: Record<string, string> = {
    "USD - US Dollar": "$",
    "GBP - British Pound": "£",
    "IDR - Indonesian Rupiah": "Rp",
    "INR - Indian Rupee": "₹",
    "BRL - Brazilian Real": "R$",
    "EUR - Germany (Euro)": "€",
    "TRY - Turkish Lira": "₺",
  };

  useEffect(() => {
    dispatch(setPageTitle(id ? 'Edit Employee' : 'Add Employee'));
    if (id) fetchEmployeeData(id);
  }, [dispatch, id]);

  const fetchEmployeeData = async (empId: string) => {
  try {
    const res = await axios.get(`https://newadmin-u8tx.onrender.com/api/employees/${empId}`);
    const emp = res.data.data; // ✅ actual data
    if (!emp) return;

    setForm(prev => ({
      ...prev,
      ...emp,
      dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.split("T")[0] : ""
    }));

    if (emp.companyLogo) {
      setLogoPreview(`${emp.companyLogo}`);
    }
  } catch (err) {
    console.error(err);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof EmployeeForm) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, [key]: file });
    if (key === 'companyLogo' && file) setLogoPreview(URL.createObjectURL(file));
  };
const [selectedCurrency, setSelectedCurrency] = useState("USD - US Dollar");
    useEffect(() => {
        dispatch(setPageTitle('Invoice Add'));
    }, [dispatch]);
 const saveInvoice = async () => {
  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  try {
    const url = id
      ? `https://newadmin-u8tx.onrender.com/api/employees/${id}`
      : 'https://newadmin-u8tx.onrender.com/api/employees';
    const method = id ? 'put' : 'post';

    await axios({
      method,
      url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    alert(id ? 'Employee updated!' : 'Employee added!');
  } catch (err) {
    console.error(err);
    alert('Error saving employee data.');
  }
};


  return (
    <div className="flex xl:flex-row flex-col gap-2.5">
      {/* LEFT PANEL */}
      <div className="panel px-4 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6 space-y-4">
        {/* Logo & Basic Info */}
        <div className="flex items-center gap-4">
<img 
  src={logoPreview || '/assets/images/cybblackpink.png'} 
  alt="Logo" 
  className="w-14" 
/>
          <input type="file" id="company-logo" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'companyLogo')} />
          <label htmlFor="company-logo" className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Upload Logo</label>
        </div>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <input id="employeeNumber" value={form.employeeNumber} onChange={handleChange} placeholder="Employee Number" className="form-input" />
          <input id="department" value={form.department} onChange={handleChange} placeholder="Department" className="form-input" />
          <input id="designation" value={form.designation} onChange={handleChange} placeholder="Designation" className="form-input" />
          <input id="dateOfJoining" value={form.dateOfJoining} onChange={handleChange} type="date" className="form-input" />
          <input id="name" value={form.name} onChange={handleChange} placeholder="Name" className="form-input" />
          <input id="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="Mobile Number" className="form-input" />
          <select id="gender" value={form.gender} onChange={handleChange} className="form-select">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input id="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father Name" className="form-input" />
          <input id="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother Name" className="form-input" />
          <input id="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Contact Number" className="form-input" />
          <input id="maritalStatus" value={form.maritalStatus} onChange={handleChange} placeholder="Marital Status" className="form-input" />
        </div>

        {/* Current Address */}
        <h3>Current Address</h3>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <input id="currentAddressLine1" value={form.currentAddressLine1} onChange={handleChange} placeholder="Address Line" className="form-input" />
          <input id="currentCity" value={form.currentCity} onChange={handleChange} placeholder="City" className="form-input" />
          <input id="currentDistrict" value={form.currentDistrict} onChange={handleChange} placeholder="District" className="form-input" />
          <input id="currentState" value={form.currentState} onChange={handleChange} placeholder="State" className="form-input" />
          <input id="currentPostalCode" value={form.currentPostalCode} onChange={handleChange} placeholder="Postal Code" className="form-input" />
          <input id="currentCountry" value={form.currentCountry} onChange={handleChange} placeholder="Country" className="form-input" />
          <input id="currentLandmark" value={form.currentLandmark} onChange={handleChange} placeholder="Landmark" className="form-input" />
        </div>

        {/* Permanent Address */}
        <h3>Permanent Address</h3>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <input id="permanentAddressLine1" value={form.permanentAddressLine1} onChange={handleChange} placeholder="Address Line" className="form-input" />
          <input id="permanentCity" value={form.permanentCity} onChange={handleChange} placeholder="City" className="form-input" />
          <input id="permanentDistrict" value={form.permanentDistrict} onChange={handleChange} placeholder="District" className="form-input" />
          <input id="permanentState" value={form.permanentState} onChange={handleChange} placeholder="State" className="form-input" />
          <input id="permanentPostalCode" value={form.permanentPostalCode} onChange={handleChange} placeholder="Postal Code" className="form-input" />
          <input id="permanentCountry" value={form.permanentCountry} onChange={handleChange} placeholder="Country" className="form-input" />
          <input id="permanentLandmark" value={form.permanentLandmark} onChange={handleChange} placeholder="Landmark" className="form-input" />
        </div>

        {/* Bank & Tax */}
        <h3>Bank & Tax Details</h3>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <input id="aadharNumber" value={form.aadharNumber} onChange={handleChange} placeholder="Aadhar Number" className="form-input" />
          <input id="panNumber" value={form.panNumber} onChange={handleChange} placeholder="PAN Number" className="form-input" />
          <input id="pfAccount" value={form.pfAccount} onChange={handleChange} placeholder="PF Account" className="form-input" />
          <input id="bankName" value={form.bankName} onChange={handleChange} placeholder="Bank Name" className="form-input" />
          <input id="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Account Number" className="form-input" />
          <input id="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="IFSC Code" className="form-input" />
        </div>

        {/* Salary & Deductions */}
        <h3>Salary Details</h3>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <input id="basic" value={form.basic} onChange={handleChange} type="number" placeholder="Basic" className="form-input" />
          <input id="hra" value={form.hra} onChange={handleChange} type="number" placeholder="HRA" className="form-input" />
          <input id="sa" value={form.sa} onChange={handleChange} type="number" placeholder="Special Allowance" className="form-input" />
          <input id="pt" value={form.pt} onChange={handleChange} type="number" placeholder="Professional Tax" className="form-input" />
          <input id="pfEc" value={form.pfEc} onChange={handleChange} type="number" placeholder="PF/ESI Contribution" className="form-input" />
          <input id="tds" value={form.tds} onChange={handleChange} type="number" placeholder="TDS" className="form-input" />
          <textarea id="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="form-input col-span-2"></textarea>
        </div>
      </div>

      {/* RIGHT PANEL */}
      {/* <div className="xl:w-96 w-full xl:mt-0 mt-6 space-y-4">
        <div className="panel space-y-4">
          <label htmlFor="currency">Currency</label>
          <select id="currency" value={form.currency} onChange={handleChange} className="form-select w-full">
            {currencyList.map(i => <option key={i}>{i}</option>)}
          </select>

          <input id="tax" value={form.tax} onChange={handleChange} type="number" placeholder="Tax (%)" className="form-input w-full" />
          <input id="deduction" value={form.deduction} onChange={handleChange} type="number" placeholder="Deduction (%)" className="form-input w-full" />
          <input id="salary" value={form.salary} onChange={handleChange} type="number" placeholder={`Salary (${currencySymbols[form.currency]})`} className="form-input w-full" />
        </div>

        <div className="panel space-y-2">
          <button type="button" className="btn btn-success w-full" onClick={saveInvoice}><IconSave /> Save</button>
          <button type="button" className="btn btn-info w-full"><IconSend /> Send</button>
          <Link to="/apps/employee/preview" className="btn btn-primary w-full"><IconEye /> Preview</Link>
          <button type="button" className="btn btn-secondary w-full"><IconDownload /> Download</button>
        </div>
      </div> */}
      <div className="xl:w-96 w-full xl:mt-0 mt-6">
                      <div className="panel mb-5">
                          <label htmlFor="currency">Currency</label>
                          <select id="currency" value={form.currency} onChange={handleChange} name="currency"
                               className="form-select">
                             {currencyList.map(i => <option key={i}>{i}</option>)}
                          </select>
      
                          <div className="mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4">
                              <div>
                                  <label htmlFor="tax">Tax(%) </label>
                                  <input id="tax" type="number" value={form.tax} onChange={handleChange} name="tax"  className="form-input" defaultValue={0} />
                              </div>
                              <div>
                                  <label htmlFor="discount">Deduction(%) </label>
                                  <input id="deduction" type="number" value={form.deduction} onChange={handleChange}  name="deduction" className="form-input"  />
                              </div>
                          </div>
      
                          <div className="mt-4">
                              <label htmlFor="salary">Salary ({currencySymbols[selectedCurrency]}) </label>
                              <input id="Salary" type="number" name="Salary" value={form.salary} onChange={handleChange} className="form-input"  />
                          </div>
      
                          {/* <div className="mt-4">
                              <label htmlFor="payment-method">Accept Payment Via</label>
                              <select id="payment-method" name="payment-method" className="form-select">
                                  <option value="">Select Payment</option>
                                  <option value="bank">Bank Account</option>
                                  <option value="paypal">Paypal</option>
                                  <option value="upi">UPI Transfer</option>
                              </select>
                          </div> */}
                      </div>
      
                      <div className="panel">
                          <div className="grid xl:grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
                              <button type="button" className="btn btn-success w-full gap-2" onClick={saveInvoice}>
                                  <IconSave className="ltr:mr-2 rtl:ml-2 shrink-0" /> Save
                              </button>
      
                              <button type="button" className="btn btn-info w-full gap-2">
                                  <IconSend className="ltr:mr-2 rtl:ml-2 shrink-0" /> Send Invoice
                              </button>
      
                             <Link to={`/apps/employee/preview/${id || form.employeeNumber}`} className="btn btn-primary w-full gap-2">
  <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" /> Preview
</Link>

                              <button type="button" className="btn btn-secondary w-full gap-2">
                                  <IconDownload className="ltr:mr-2 rtl:ml-2 shrink-0" /> Download
                              </button>
                          </div>
                      </div>
                  </div>
    </div>
  );
};

export default Edit;
