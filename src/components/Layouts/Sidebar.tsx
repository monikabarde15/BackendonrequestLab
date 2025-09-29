import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMinus from '../Icon/IconMinus';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuTables from '../Icon/Menu/IconMenuTables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuAuthentication from '../Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';

interface MenuItem {
  key?: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  external?: boolean;
  permission?: string;
  subMenu?: MenuItem[];
  items?: MenuItem[];
  sectionLabel?: string;
}

const Sidebar = () => {
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Fetch employee details and permissions
  const fetchEmployeeDetails = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const employeeId = user.user?._id;
    if (!employeeId || user.user.role !== 'employee') return;

    try {
      const response = await axios.get(`https://cybitbackend.onrender.com/api/employees/${employeeId}`);
      const empPermissions = response.data.data.permissions || [];
      setPermissions(empPermissions);
    } catch (error) {
      console.error("Error fetching employee details", error);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  useEffect(() => {
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    if (selector) {
      selector.classList.add('active');
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
  };

  // Full menu structure
  const menuItems: MenuItem[] = [
    {
      key: "dashboard",
      label: "dashboard",
      icon: IconMenuDashboard,
      subMenu: [
        { path: "/index", label: "sales", permission: "sales" },
        // { path: "/analytics", label: "analytics", permission: "analytics" },
        // { path: "/finance", label: "finance", permission: "finance" },
        // { path: "/crypto", label: "crypto", permission: "crypto" },
      ],
    },
    {
      sectionLabel: "apps",
      items: [
        // { path: "/apps/todolist", label: "todo_list", icon: IconMenuTodo, permission: "todolist" },
         { path: "/apps/Blogs", label: "Blogs", icon: IconMenuTodo, permission: "Blogs" },
        // { path: "/apps/notes", label: "notes", icon: IconMenuNotes, permission: "notes" },
        { path: "/apps/scrumboard", label: "scrumboard", icon: IconMenuScrumboard, permission: "scrumboard" },
        { path: "/apps/contacts", label: "contacts", icon: IconMenuContacts, permission: "contacts" },
        { path: "/apps/calendar", label: "calendar", icon: IconMenuCalendar, permission: "calendar" },
      ],
    },
    {
      key: "invoice",
      label: "invoice",
      icon: IconMenuInvoice,
      subMenu: [
        { path: "/apps/invoice/list", label: "list", permission: "invoice_list" },
        { path: "/apps/invoice/add", label: "add", permission: "invoice_add" },
      ],
    },
    {
      key: "expenses",
      label: "Expenses",
      icon: IconMenuInvoice,
      subMenu: [
        { path: "/apps/expenses/list", label: "list", permission: "expenses_list" },
        { path: "/apps/expenses/add", label: "add", permission: "expenses_add" },
      ],
    },
     {
      key: "estimation",
      label: "Estimation",
      icon: IconMenuInvoice,
      subMenu: [
        { path: "/apps/Estimation/list", label: "list", permission: "estimation_list" },
        { path: "/apps/Estimation/add", label: "add", permission: "estimation_add" },
      ],
    },
    {
      sectionLabel: "employee management",
      items: [
        { path: "/apps/employee/list", label: "Employee List", icon: IconMenuTodo, permission: "employeelist" },
        { path: "/datatables/order-sorting", label: "Role & Permission", icon: IconMenuTodo, permission: "roles" },
      ],
    },
    {
        sectionLabel: "Tables And Forms",
      key: "datatables",
      label: "datatables",
      icon: IconMenuDatatables,
      subMenu: [
        { path: "/datatables/basic", label: "basic", permission: "datatables_basic" },
        { path: "/datatables/advanced", label: "advanced", permission: "datatables_advanced" },
        { path: "/datatables/skin", label: "skin", permission: "datatables_skin" },
        { path: "/datatables/order-sorting", label: "order_sorting", permission: "datatables_order" },
      ],
    },
    {
      key: "forms",
      label: "forms",
      icon: IconMenuForms,
      subMenu: [
        { path: "/forms/basic", label: "basic", permission: "forms_basic" },
        { path: "/forms/input-group", label: "input_group", permission: "forms_input" },
      ],
    },
    {
      key: "users",
      label: "users",
      icon: IconMenuUsers,
      subMenu: [
        { path: "/users/profile", label: "profile", permission: "users_profile" },
        { path: "/users/user-account-settings", label: "account_settings", permission: "users_settings" },
      ],
    },
    {
      key: "pages",
      label: "pages",
      icon: IconMenuPages,
      subMenu: [
        { path: "/pages/knowledge-base", label: "knowledge_base", permission: "pages_kb" },
        { path: "/pages/faq", label: "faq", permission: "pages_faq" },
      ],
    },
    {
      key: "auth",
      label: "authentication",
      icon: IconMenuAuthentication,
      subMenu: [
        { path: "/auth/boxed-signin", label: "login_boxed", permission: "auth_login" },
        { path: "/auth/boxed-signup", label: "register_boxed", permission: "auth_register" },
      ],
    },
    // {
    //   sectionLabel: "supports",
    //   items: [
    //     { path: "https://vristo.sbthemes.com", label: "documentation", icon: IconMenuDocumentation, external: true },
    //   ],
    // },
  ];

  // Filter menu for employee
  const user = JSON.parse(localStorage.getItem("user") || "{}");
const role = user?.user?.role;

const filteredMenuItems = menuItems
  .map(item => {
    // Agar employee hai → filter karo
    if (role === 'employee') {
      let newItem = { ...item };

      if (item.subMenu) {
        newItem.subMenu = item.subMenu.filter(sm => permissions.includes(sm.permission || ''));
      }

      if (item.items) {
        newItem.items = item.items.filter(it => permissions.includes(it.permission || ''));
      }

      return newItem;
    }

    // Agar employee nahi → pura item waisa ka waisa
    return item;
  })
  // Remove items/sections jinke andar kuch visible na ho (sirf employee case me)
  .filter(item => role !== 'employee' || (item.subMenu?.length || item.items?.length));

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
      >
        <div className="bg-white dark:bg-black h-full">
          <div className="flex justify-between items-center px-12 py-3">
            <NavLink to="/" className="main-logo flex items-center shrink-0 ">
              <img className="w-20 flex-none" src="/assets/images/cybblackpink.png" alt="logo" />
            </NavLink>

            <button
              type="button"
              className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>

          <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
              {filteredMenuItems.map((menu, idx) => (
                <React.Fragment key={idx}>
                  {menu.sectionLabel && (
                    <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                      <IconMinus className="w-4 h-5 flex-none hidden" />
                      <span>{t(menu.sectionLabel)}</span>
                    </h2>
                  )}
                  {menu.items && menu.items.length > 0 && menu.items.map((it, i) => (
                    <li className="nav-item" key={i}>
                      <NavLink to={it.path || '#'} className="group">
                        <div className="flex items-center">
                          {it.icon && <it.icon className="group-hover:!text-primary shrink-0" />}
                          <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                            {t(it.label)}
                          </span>
                        </div>
                      </NavLink>
                    </li>
                  ))}
                  {menu.subMenu && menu.subMenu.length > 0 && (
                    <li className="menu nav-item">
                      <button
                        type="button"
                        className={`${currentMenu === menu.key ? 'active' : ''} nav-link group w-full`}
                        onClick={() => toggleMenu(menu.key || '')}
                      >
                        <div className="flex items-center">
                          {menu.icon && <menu.icon className="group-hover:!text-primary shrink-0" />}
                          <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t(menu.label)}</span>
                        </div>
                        <div className={currentMenu !== menu.key ? 'rtl:rotate-90 -rotate-90' : ''}>
                          <IconCaretDown />
                        </div>
                      </button>
                      <AnimateHeight duration={300} height={currentMenu === menu.key ? 'auto' : 0}>
                        <ul className="sub-menu text-gray-500">
                          {menu.subMenu.map((sm, si) => (
                            <li key={si}>
                              <NavLink to={sm.path || '#'}>{t(sm.label)}</NavLink>
                            </li>
                          ))}
                        </ul>
                      </AnimateHeight>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
