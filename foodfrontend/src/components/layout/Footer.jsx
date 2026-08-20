import { Link } from 'react-router-dom';
import I, { BrandIcons } from '../icons';

const Footer = ({ simple = false }) => {
  if (simple) {
    return (
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} FreshEye AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <Link to="#" className="hover:text-primary-500 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-primary-500 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-primary-500 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    );
  }

  const socialIcon = (Icon) => (
    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-gradient-to-br hover:from-primary-500 hover:via-secondary-500 hover:to-accent-500 transition-all cursor-pointer group">
      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
    </div>
  );

  return (
    <footer className="relative bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-500 blur-md opacity-50 rounded-2xl" />
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center shadow-lg">
                  <I.Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="font-black text-2xl text-slate-800 dark:text-white leading-none">FreshEye</p>
                <span className="text-[10px] text-primary-500 font-black tracking-[0.18em]">AI PLATFORM</span>
              </div>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mb-6">
              AI-powered food freshness intelligence. Reduce waste, save money, and eat healthier — all from a single photo.
            </p>
            <div className="flex items-center gap-3 mb-6">
              {socialIcon(BrandIcons.FaTwitter)}
              {socialIcon(BrandIcons.FaLinkedinIn)}
              {socialIcon(BrandIcons.FaGithub)}
              {socialIcon(BrandIcons.FaInstagram)}
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 max-w-sm">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
                <I.Mail className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">Stay Updated</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">hello@fresheye.ai</p>
              </div>
            </div>
          </div>

          {[
            { title: 'Product', links: ['Dashboard', 'Upload', 'History', 'Recommendations', 'API Access'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Research', 'Blog', 'Press'] },
            { title: 'Resources', links: ['Documentation', 'Help Center', 'Guides', 'Changelog', 'Status'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-black text-slate-800 dark:text-white mb-5 uppercase tracking-wider text-xs">{col.title}</h4>
              <ul className="space-y-3.5">
                {col.links.map(l => (
                  <li key={l}>
                    <Link to="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 hover:translate-x-1 inline-block transition-all">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} FreshEye AI. All rights reserved. Crafted with care for our planet 🌍
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Terms of Service</Link>
            <Link to="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">Cookies</Link>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
              </span>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
