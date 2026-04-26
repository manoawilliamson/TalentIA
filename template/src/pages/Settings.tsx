import React, { useState } from 'react';
import { FaCog, FaUser, FaBell, FaShieldAlt, FaPalette, FaDatabase, FaSave, FaCamera } from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: 'Admin User',
    email: 'admin@talentia.com',
    role: 'Administrateur',
    department: 'IT',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionné par la technologie et l\'innovation',
    notifications: true,
    twoFactor: false,
    theme: 'light',
    language: 'fr'
  });

  const tabs = [
    { id: 'profile', name: 'Profil', icon: <FaUser /> },
    { id: 'notifications', name: 'Notifications', icon: <FaBell /> },
    { id: 'security', name: 'Sécurité', icon: <FaShieldAlt /> },
    { id: 'appearance', name: 'Apparence', icon: <FaPalette /> },
    { id: 'data', name: 'Données', icon: <FaDatabase /> },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save logic here
    console.log('Settings saved:', formData);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaCog className="text-blue-600 text-sm" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        </div>
        <p className="text-gray-600">Gérez vos préférences et paramètres du compte</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-8 shadow-lg">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Informations Personnelles</h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2">
                    <FaSave className="text-sm" />
                    Enregistrer
                  </button>
                </div>

                {/* Profile Picture */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      AU
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <FaCamera className="text-gray-600 text-xs" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Admin User</h3>
                    <p className="text-gray-600">admin@talentia.com</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                      Changer la photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom Complet</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Préférences de Notification</h2>
                <div className="space-y-4">
                  {[
                    { title: 'Notifications par email', desc: 'Recevoir les notifications importantes par email', enabled: true },
                    { title: 'Notifications push', desc: 'Notifications push dans le navigateur', enabled: true },
                    { title: 'Notifications SMS', desc: 'Alertes SMS pour les urgences', enabled: false },
                    { title: 'Rapports hebdomadaires', desc: 'Résumé hebdomadaire de l\'activité', enabled: true },
                    { title: 'Mises à jour système', desc: 'Informations sur les mises à jour', enabled: false },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => handleInputChange(`notification_${index}`, !item.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.enabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Sécurité</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Mot de passe</h4>
                    <p className="text-sm text-gray-600 mb-3">Dernière modification: il y a 30 jours</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Changer le mot de passe
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Authentification à deux facteurs</h4>
                    <p className="text-sm text-gray-600 mb-3">Ajoutez une couche de sécurité supplémentaire</p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Activer 2FA
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Sessions actives</h4>
                    <p className="text-sm text-gray-600 mb-3">2 sessions actives</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Gérer les sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Apparence</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleInputChange('theme', theme)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.theme === theme
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-medium capitalize">{theme}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Data Tab */}
            {activeTab === 'data' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Gestion des Données</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Exporter les données</h4>
                    <p className="text-sm text-gray-600 mb-3">Téléchargez toutes vos données au format JSON</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Exporter
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Supprimer le compte</h4>
                    <p className="text-sm text-gray-600 mb-3">Cette action est irréversible</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Supprimer le compte
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
