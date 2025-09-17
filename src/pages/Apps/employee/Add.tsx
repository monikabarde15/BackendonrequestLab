import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconX from '../../../components/Icon/IconX';
import IconDownload from '../../../components/Icon/IconDownload';
import IconEye from '../../../components/Icon/IconEye';
import IconSend from '../../../components/Icon/IconSend';
import IconSave from '../../../components/Icon/IconSave';
import axios from 'axios';
import Select from 'react-select';

 
const Add = () => {
    const dispatch = useDispatch();

    const [items, setItems] = useState<any>([
        { id: 1, title: '', description: '', rate: 0, quantity: 0, amount: 0 },
    ]);
const [selectedCurrency, setSelectedCurrency] = useState("USD - US Dollar");
    useEffect(() => {
        dispatch(setPageTitle('Invoice Add'));
    }, [dispatch]);

    const currencyList = [
        'USD - US Dollar',
        'GBP - British Pound',
        'IDR - Indonesian Rupiah',
        'INR - Indian Rupee',
        'BRL - Brazilian Real',
        'EUR - Germany (Euro)',
        'TRY - Turkish Lira',
    ];
      

   
 const currencySymbols: any = {
        "USD - US Dollar": "$",
        "GBP - British Pound": "£",
        "IDR - Indonesian Rupiah": "Rp",
        "INR - Indian Rupee": "₹",
        "BRL - Brazilian Real": "R$",
        "EUR - Germany (Euro)": "€",
        "TRY - Turkish Lira": "₺",
    };
    const addItem = () => {
        let maxId = items.length
            ? items.reduce((max: number, i: any) => (i.id > max ? i.id : max), items[0].id)
            : 0;
        setItems([...items, { id: maxId + 1, title: '', description: '', rate: 0, quantity: 0, amount: 0 }]);
    };

    const removeItem = (item: any) => {
        setItems(items.filter((i: any) => i.id !== item.id));
    };

    const changeQuantityPrice = (type: string, value: string, id: number) => {
        const list = [...items];
        const item = list.find((i: any) => i.id === id);
        if (!item) return;
        if (type === 'quantity') item.quantity = Number(value);
        if (type === 'price') item.amount = Number(value);
        setItems(list);
    };

    // --- FIXED saveInvoice INSIDE COMPONENT ---
    const saveInvoice = async () => {
    const formData = new FormData();

    // Employee Info
    formData.append("employeeNumber", (document.getElementById('number') as HTMLInputElement).value);
    formData.append("department", (document.getElementById('invoiceLabel') as HTMLInputElement).value);
    formData.append("designation", (document.getElementById('desingnation') as HTMLInputElement).value);
    formData.append("dateOfJoining", (document.getElementById('dateOfJoining') as HTMLInputElement).value);

    // Personal Details
    formData.append("name", (document.getElementById('name') as HTMLInputElement).value);
    // formData.append("email", (document.getElementById('email') as HTMLInputElement).value);
    formData.append("mobileNumber", (document.getElementById('mobile_number') as HTMLInputElement).value);
    formData.append("gender", (document.getElementById('gender') as HTMLSelectElement).value);
    formData.append("fatherName", (document.getElementById('father-name') as HTMLInputElement).value);
    formData.append("motherName", (document.getElementById('mother_name') as HTMLInputElement).value);
    formData.append("contactNumber", (document.getElementById('contact_number') as HTMLInputElement).value);
    formData.append("maritalStatus", (document.getElementById('marital-status') as HTMLSelectElement).value);

    // Current Address
    formData.append("currentAddressLine1", (document.getElementById('current-address-line1') as HTMLInputElement).value);
    formData.append("currentCity", (document.getElementById('current-city') as HTMLInputElement).value);
    formData.append("currentDistrict", (document.getElementById('current-district') as HTMLInputElement).value);
    formData.append("currentState", (document.getElementById('current-state') as HTMLInputElement).value);
    formData.append("currentPostalCode", (document.getElementById('current-postal') as HTMLInputElement).value);
    formData.append("currentCountry", (document.getElementById('current-country') as HTMLSelectElement).value);
    formData.append("currentLandmark", (document.getElementById('current-landmark') as HTMLInputElement).value);

    // Permanent Address
    formData.append("permanentAddressLine1", (document.getElementById('permanent-address-line1') as HTMLInputElement).value);
    formData.append("permanentCity", (document.getElementById('permanent-city') as HTMLInputElement).value);
    formData.append("permanentDistrict", (document.getElementById('permanent-district') as HTMLInputElement).value);
    formData.append("permanentState", (document.getElementById('permanent-state') as HTMLInputElement).value);
    formData.append("permanentPostalCode", (document.getElementById('permanent-postal') as HTMLInputElement).value);
    formData.append("permanentCountry", (document.getElementById('permanent-country') as HTMLSelectElement).value);
    formData.append("permanentLandmark", (document.getElementById('permanent-landmark') as HTMLInputElement).value);

    // Bank Details
    formData.append("aadharNumber", (document.getElementById('aadhar-number') as HTMLInputElement).value);
    formData.append("panNumber", (document.getElementById('pan-number') as HTMLInputElement).value);
    formData.append("pfAccount", (document.getElementById('pf-account') as HTMLInputElement).value);
    formData.append("bankName", (document.getElementById('bank-name') as HTMLInputElement).value);
    formData.append("accountNumber", (document.getElementById('acno') as HTMLInputElement).value);
    formData.append("ifscCode", (document.getElementById('ifsc-code') as HTMLInputElement).value);

    // Earnings & Deductions
    formData.append("basic", (document.getElementById('basic') as HTMLInputElement).value);
    formData.append("hra", (document.getElementById('hra') as HTMLInputElement).value);
    formData.append("sa", (document.getElementById('sa') as HTMLInputElement).value);
    formData.append("pt", (document.getElementById('pt') as HTMLInputElement).value);
    formData.append("pfEc", (document.getElementById('pf-ec') as HTMLInputElement).value);
    formData.append("tds", (document.getElementById('tds') as HTMLInputElement).value);

    // Notes
    formData.append("notes", (document.getElementById('notes') as HTMLTextAreaElement).value);

    // Currency & Tax
    formData.append("currency", (document.getElementById('currency') as HTMLSelectElement).value);
    formData.append("tax", (document.getElementById('tax') as HTMLInputElement).value);
    formData.append("deduction", (document.getElementById('deduction') as HTMLInputElement).value);
    formData.append("salary", (document.getElementById('Salary') as HTMLInputElement).value);

    // Files
    const aadharFile = (document.getElementById('aadhar-file') as HTMLInputElement)?.files?.[0];
    if (aadharFile) formData.append("aadharFile", aadharFile);

    const panFile = (document.getElementById('pan-file') as HTMLInputElement)?.files?.[0];
    if (panFile) formData.append("panFile", panFile);

    const logoFile = (document.getElementById('company-logo') as HTMLInputElement)?.files?.[0];
    if (logoFile) formData.append("companyLogo", logoFile);

    try {
        const res = await axios.post('https://newadmin-u8tx.onrender.com/api/employees', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data) {
            alert('Employee saved! ');
        }
    } catch (err) {
        console.error(err);
        alert('Error saving invoice.');
    }
};

const [logoPreview, setLogoPreview] = useState<string>('');

const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setLogoPreview(URL.createObjectURL(file));
    }
};

    return (
        <div className="flex xl:flex-row flex-col gap-2.5">
            {/* LEFT PANEL */}
            <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                {/* Invoice Info */}
                <div className="flex justify-between flex-wrap px-4">
                    <div className="mb-6 lg:w-1/2 w-full">
                        <div className="flex items-center text-black dark:text-white shrink-0">
                            {/* Current Logo or Preview */}
                            <img
                                src={logoPreview || "/assets/images/cybblackpink.png"}
                                alt="Company Logo"
                                className="w-14 h-14 object-cover rounded"
                            />

                            {/* Upload Input */}
                            <input
                                id="company-logo"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                            />

                            {/* Styled Upload Button */}
                            <label
                                htmlFor="company-logo"
                                className="ml-4 cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                            >
                                Upload Logo
                            </label>
                        </div>
                        <div className="space-y-1 mt-6 text-gray-500 dark:text-gray-400">
                            <div>G-9/85,Sangam Vihar New Delhi-110080</div>
                            <div>info@cybite.in</div>
                            <div>+91 8210543772</div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full lg:max-w-fit">
                        {/* Invoice Number */}
                        <div className="flex items-center">
                            <label htmlFor="number" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Employee Number</label>
                            <input id="number" type="text" className="form-input lg:w-[250px] w-2/3" placeholder="#8801" />
                        </div>
                        {/* Invoice Label */}
                        <div className="flex items-center mt-4">
                            <label htmlFor="invoiceLabel" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Department</label>
                            <input id="invoiceLabel" type="text" className="form-input lg:w-[250px] w-2/3" placeholder="Enter Department" />
                        </div>
                        <div className="flex items-center mt-4">
                            <label htmlFor="desingnation" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Designation</label>
                            <input id="desingnation" type="text" className="form-input lg:w-[250px] w-2/3" placeholder="Enter Designation" />
                        </div>
                        {/* Dates */}
                        <div className="flex items-center mt-4">
                            <label htmlFor="startDate" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">Date Of Joining</label>
                            <input id="dateOfJoining" type="date" className="form-input lg:w-[250px] w-2/3" />
                        </div>
                        
                    </div>
                </div>

                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />

                {/* Bill To & Payment Details */}
                  <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Personal Details</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Name</label>
                                <input id="name" type="text" className="form-input flex-1" placeholder="Enter Name" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-email" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Email</label>
                                <input id="reciever-email" type="email" className="form-input flex-1" placeholder="Enter Email" />
                            </div>

                            <div className="mt-4 flex items-center">
                                <label htmlFor="mobile_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Mobile Number</label>
                                <input id="mobile_number" type="number" className="form-input flex-1" placeholder="Enter Mobile Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label
                                    htmlFor="country"
                                    className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0"
                                >
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    className="form-select flex-1 border rounded-md p-2"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                    Select Gender
                                    </option>
                                    <option value="india">Male</option>
                                    <option value="usa">FeMale</option>
                                </select>
                                </div>

                            
                        </div>

                        {/* Payment Details */}
                        <div className="lg:w-1/2 w-full">
                        <br />
                            <div className="text-lg"></div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="father-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Father's/Husband Name</label>
                                <input id="father-name" type="text" className="form-input flex-1" placeholder="Enter Father's Name" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="mother_name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Mother's Name</label>
                                <input id="mother_name" type="text" className="form-input flex-1" placeholder="Enter Mother's Name" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="contact_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Contact Number</label>
                                <input id="contact_number" type="text" className="form-input flex-1" placeholder="Enter Contact Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label
                                    htmlFor="country"
                                    className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0"
                                >
                                    Marital Status
                                </label>
                                <select
                                    id="marital-status"
                                    className="form-select flex-1 border rounded-md p-2"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                    Select Marital Status
                                    </option>
                                    <option value="india">Marride</option>
                                    <option value="usa">Singale</option>
                                </select>
                                </div>
                            
                        </div>
                    </div>
                </div>
                 <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Cuurent Address Details</div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="aadhar_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">ADD Line 1</label>
                                <input id="current-address-line1" type="text" className="form-input flex-1" placeholder="Enter (House/Flat No., Street, Locality)" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pan_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">City / Town</label>
                                <input id="current-city" type="text" className="form-input flex-1" placeholder="Enter City / Town" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">District / County </label>
                                <input id="current-district" type="text" className="form-input flex-1" placeholder="Enter District / County" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">State / Province / Region</label>
                                <input id="current-state" type="text" className="form-input flex-1" placeholder="Enter State / Province / Region" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Postal Code / ZIP Code </label>
                                <input id="current-postal" type="text" className="form-input flex-1" placeholder="Enter Postal Code / ZIP Code" />
                            </div>
                           <div className="mt-4 flex items-center">
                            <label
                                htmlFor="country"
                                className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0"
                            >
                                Country
                            </label>
                            <select
                                id="current-country"
                                className="form-select flex-1 border rounded-md p-2"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                Select Country
                                </option>
                                <option value="india">India</option>
                                <option value="usa">USA</option>
                                <option value="uk">UK</option>
                                <option value="canada">Canada</option>
                            </select>
                            </div>

                             <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Nearest Landmark </label>
                                <input id="current-landmark" type="text" className="form-input flex-1" placeholder="Enter Nearest Landmark" />
                            </div>
                            
                        </div>

                        {/* Payment Details */}
                        <div className="lg:w-1/2 w-full">
                            <div className="text-lg">Permanent Address</div>
                              <div className="mt-4 flex items-center">
                                <label htmlFor="aadhar_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">ADD Line 1</label>
                                <input id="permanent-address-line1" type="text" className="form-input flex-1" placeholder="Enter (House/Flat No., Street, Locality)" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pan_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">City / Town</label>
                                <input id="permanent-city" type="text" className="form-input flex-1" placeholder="Enter City / Town" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">District / County </label>
                                <input id="permanent-district" type="text" className="form-input flex-1" placeholder="Enter District / County" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">State / Province / Region</label>
                                <input id="permanent-state" type="text" className="form-input flex-1" placeholder="Enter State / Province / Region" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Postal Code / ZIP Code </label>
                                <input id="permanent-postal" type="text" className="form-input flex-1" placeholder="Enter Postal Code / ZIP Code" />
                            </div>
                           <div className="mt-4 flex items-center">
                            <label
                                htmlFor="permanent-country"
                                className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0"
                            >
                                Country
                            </label>
                            <select
                                id="permanent-country"
                                className="form-select flex-1 border rounded-md p-2"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                Select Country
                                </option>
                                <option value="india">India</option>
                                <option value="usa">USA</option>
                                <option value="uk">UK</option>
                                <option value="canada">Canada</option>
                            </select>
                            </div>

                             <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Nearest Landmark </label>
                                <input id="permanent-landmark" type="text" className="form-input flex-1" placeholder="Enter Nearest Landmark" />
                            </div>
                        </div>
                    </div>
                </div>
                          
                <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Bank Details</div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="aadhar_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Aadhar Number</label>
                                <input id="aadhar-number" type="text" className="form-input flex-1" placeholder="Enter Aadhar Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pan_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Pan Number</label>
                                <input id="pan-number" type="text" className="form-input flex-1" placeholder="Enter Pan Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">PF A/C </label>
                                <input id="pf-account" type="text" className="form-input flex-1" placeholder="Enter PF A/C" />
                            </div>
                            
                        </div>

                        {/* Payment Details */}
                        <div className="lg:w-1/2 w-full">
                          <br />
                            <div className="text-lg"></div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="bank-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Bank Name</label>
                                <input id="bank-name" type="text" className="form-input flex-1" placeholder="Enter Bank Name" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="acno" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Account Number</label>
                                <input id="acno" type="text" className="form-input flex-1" placeholder="Enter Account Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="ifsc-code" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">IFSC Code</label>
                                <input id="ifsc-code" type="text" className="form-input flex-1" placeholder="Enter IFSC Code" />
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        {/* Bill To */}
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Earnings</div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="aadhar_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">Basic</label>
                                <input id="basic" type="text" className="form-input flex-1" placeholder="Enter Basic" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pan_number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">H R A</label>
                                <input id="hra" type="text" className="form-input flex-1" placeholder="Enter House Rent Allowance" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="pf" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">S A</label>
                                <input id="sa" type="text" className="form-input flex-1" placeholder="Enter Special Allowance" />
                            </div>
                            
                        </div>

                        {/* Payment Details */}
                        <div className="lg:w-1/2 w-full">
                            <div className="text-lg">Deductions</div>
                             <div className="mt-4 flex items-center">
                                <label htmlFor="bank-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">P T</label>
                                <input id="pt" type="text" className="form-input flex-1" placeholder="Enter Profession Tax" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="acno" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">PF E C</label>
                                <input id="pf-ec" type="text" className="form-input flex-1" placeholder="Enter PF Employee Contribution" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="ifsc-code" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">TDS</label>
                                <input id="tds" type="text" className="form-input flex-1" placeholder="Enter TDS" />
                            </div>
                        </div>
                    </div>
                </div>

              
               

                {/* Notes */}
                <div className="mt-8 px-4">
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" className="form-textarea min-h-[130px]" placeholder="Notes...."></textarea>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="xl:w-96 w-full xl:mt-0 mt-6">
                <div className="panel mb-5">
                    <label htmlFor="currency">Currency</label>
                    <select id="currency" name="currency" value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)} className="form-select">
                        {currencyList.map((i) => (
                            <option key={i}>{i}</option>
                        ))}
                    </select>

                    <div className="mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="tax">Tax(%) </label>
                            <input id="tax" type="number" name="tax" className="form-input" defaultValue={0} />
                        </div>
                        <div>
                            <label htmlFor="discount">Deduction(%) </label>
                            <input id="deduction" type="number" name="deduction" className="form-input" defaultValue={0} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="salary">Salary ({currencySymbols[selectedCurrency]}) </label>
                        <input id="Salary" type="number" name="Salary" className="form-input" defaultValue={0} />
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

                        <Link to="/apps/invoice/preview" className="btn btn-primary w-full gap-2">
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

export default Add;
