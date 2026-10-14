import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  MapPin,
  X,
  RotateCw,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Navigation,
  ShieldCheck,
  Building2,
  Sparkles,
  Info,
} from 'lucide-react';
import { CivicProject, PoliticalWard } from '../types';
import { IDANRE_WARDS, IFEDORE_WARDS } from '../data/civicData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedProject?: CivicProject | null;
  projects: CivicProject[];
  user: { name: string; username: string; lga: 'Idanre' | 'Ifedore' };
  onSubmitReport: (
    projectId: string,
    statusClaimed: CivicProject['status'],
    note: string,
    photoUrl?: string,
    coordinates?: { lat: number; lng: number; accuracy?: number },
    geotagLabel?: string,
    reportType?: 'Project Update' | 'New Infrastructure Need' | 'Urgent Defect / Hazard',
    priority?: 'High / Critical' | 'Moderate' | 'Routine'
  ) => void;
  onCreateNewNeed?: (projectData: Omit<CivicProject, 'id' | 'residentReports'>) => void;
  onToast: (msg: string) => void;
}

// Landmark approximate coordinates for intelligent proximity matching in Idanre & Ifedore
const KNOWN_COORDINATES = [
  { name: 'Odode Idanre Central & Palace', ward: 'Idale-Logbosere', lga: 'Idanre', lat: 7.1105, lng: 5.1189 },
  { name: 'Oke Idanre 682 Steps Ascent', ward: 'Irowo', lga: 'Idanre', lat: 7.1082, lng: 5.1054 },
  { name: 'Alade Idanre Commercial Junction', ward: 'Alade/Atosin', lga: 'Idanre', lat: 7.1352, lng: 5.1501 },
  { name: 'Atosin Cocoa Agricultural Belt', ward: 'Alade/Atosin', lga: 'Idanre', lat: 7.1420, lng: 5.1610 },
  { name: 'Ijomu Market & Isurin Transit', ward: 'Ijomu/Isurin', lga: 'Idanre', lat: 7.1020, lng: 5.1240 },
  { name: 'Ofosu / Onisere River Bridge Corridor', ward: 'Ofosu/Onisere', lga: 'Idanre', lat: 6.9450, lng: 5.0210 },
  { name: 'Igbara-Oke Central Junction', ward: 'Igbara-Oke I', lga: 'Ifedore', lat: 7.4102, lng: 5.0601 },
  { name: 'Ilara-Mokin Agribusiness & Tech Hub', ward: 'Ilara I', lga: 'Ifedore', lat: 7.3512, lng: 5.1089 },
  { name: 'Ijare Town Square & Cocoa Weighing Station', ward: 'Ijare I', lga: 'Ifedore', lat: 7.3620, lng: 5.1820 },
  { name: 'Ipogun / Ero Water Dam Valley', ward: 'Ipogun/Ibule/Ero', lga: 'Ifedore', lat: 7.3820, lng: 5.1250 },
];

export const CameraGeotagReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preselectedProject,
  projects,
  user,
  onSubmitReport,
  onCreateNewNeed,
  onToast,
}) => {
  // Target Project / Mode
  const [reportTargetMode, setReportTargetMode] = useState<'existing' | 'new-need'>(
    preselectedProject ? 'existing' : 'existing'
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    preselectedProject ? preselectedProject.id : (projects[0]?.id || '')
  );

  // New Need Form Fields (if reporting a new need)
  const [newNeedTitle, setNewNeedTitle] = useState('');
  const [newNeedCategory, setNewNeedCategory] = useState<CivicProject['category']>('Roads & Infrastructure');
  const [newNeedWardId, setNewNeedWardId] = useState(IDANRE_WARDS[0]?.id || 'ward_idn_01');
  const [newNeedLga, setNewNeedLga] = useState<'Idanre' | 'Ifedore'>('Idanre');

  // Shared Report Details
  const [statusClaimed, setStatusClaimed] = useState<CivicProject['status']>('In Progress');
  const [reportType, setReportType] = useState<'Project Update' | 'New Infrastructure Need' | 'Urgent Defect / Hazard'>(
    preselectedProject ? 'Project Update' : 'New Infrastructure Need'
  );
  const [priority, setPriority] = useState<'High / Critical' | 'Moderate' | 'Routine'>('Moderate');
  const [reportNote, setReportNote] = useState('');

  // Camera & Image States
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Geotagging States
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [geotagLabel, setGeotagLabel] = useState<string>('');
  const [manualWard, setManualWard] = useState<string>('Idale-Logbosere');
  const [manualLandmark, setManualLandmark] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preselected project if passed
  useEffect(() => {
    if (preselectedProject) {
      setSelectedProjectId(preselectedProject.id);
      setReportTargetMode('existing');
      setReportType('Project Update');
    }
  }, [preselectedProject]);

  // Clean up camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Start live WebRTC Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser. Please use the file upload button.');
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. You can still upload a photo from your gallery below.'
          : 'Unable to start camera preview. Please choose a photo from your device.'
      );
      setCameraActive(false);
    }
  };

  // Flip between front & back camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraActive) {
      stopCamera();
      setTimeout(() => {
        setFacingMode(nextMode);
        startCamera();
      }, 200);
    }
  };

  // Capture frame from video to canvas
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Optional: Draw subtle geotag watermark on photo canvas
    if (coordinates) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(
        `📍 ${coordinates.lat.toFixed(4)}°N, ${coordinates.lng.toFixed(4)}°E · ${geotagLabel || 'Ok Idanre Civic Log'}`,
        16,
        canvas.height - 16
      );
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    stopCamera();
    onToast('Snapshot captured! Geotag stamped.');
  };

  // Fallback: Upload from file / mobile camera prompt
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setCapturedPhoto(result);
      stopCamera();
      onToast('Photo uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  // Get Geolocation
  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      onToast('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        setCoordinates({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy) });

        // Calculate closest known Ondo State landmark
        let closest = KNOWN_COORDINATES[0];
        let minDist = Infinity;
        for (const loc of KNOWN_COORDINATES) {
          const dist = Math.hypot(loc.lat - latitude, loc.lng - longitude);
          if (dist < minDist) {
            minDist = dist;
            closest = loc;
          }
        }

        const resolvedLabel = `${closest.name} (${closest.ward} Ward, ${closest.lga})`;
        setGeotagLabel(resolvedLabel);
        setManualWard(closest.ward);
        setManualLandmark(closest.name);
        setIsLocating(false);
        onToast(`GPS coordinates locked: ±${Math.round(accuracy)}m accuracy`);
      },
      err => {
        console.warn('Geolocation error:', err);
        // Fallback to default landmark coordinates
        const fallback = KNOWN_COORDINATES[0];
        setCoordinates({ lat: fallback.lat, lng: fallback.lng, accuracy: 25 });
        setGeotagLabel(`${fallback.name} (${fallback.ward})`);
        setIsLocating(false);
        onToast('Using default ward GPS coordinates.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Auto-fetch location on open
  useEffect(() => {
    if (isOpen && !coordinates) {
      fetchCurrentLocation();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportNote.trim()) {
      onToast('Please describe your field observation note.');
      return;
    }

    const finalGeotag = geotagLabel.trim() || `${manualLandmark || 'Central Corridors'} · ${manualWard}`;

    if (reportTargetMode === 'existing') {
      const targetId = selectedProjectId || (projects[0]?.id ?? '');
      if (!targetId) {
        onToast('Please select a project to report on.');
        return;
      }

      onSubmitReport(
        targetId,
        statusClaimed,
        reportNote.trim(),
        capturedPhoto || undefined,
        coordinates || undefined,
        finalGeotag,
        reportType,
        priority
      );
    } else {
      // New Infrastructure Need
      if (!newNeedTitle.trim()) {
        onToast('Please provide a title for this infrastructure need.');
        return;
      }

      const allWards = [...IDANRE_WARDS, ...IFEDORE_WARDS];
      const wardObj = allWards.find(w => w.id === newNeedWardId) || IDANRE_WARDS[0];

      if (onCreateNewNeed) {
        onCreateNewNeed({
          title: newNeedTitle.trim(),
          description: reportNote.trim(),
          wardId: wardObj.id,
          wardName: wardObj.name,
          lga: newNeedLga,
          category: newNeedCategory,
          fundingLevel: 'Community Co-sponsored',
          budgetAmount: 5000000,
          status: statusClaimed,
          progressPercentage: statusClaimed === 'Completed' ? 100 : statusClaimed === 'In Progress' ? 35 : 0,
          contractorOrAgency: 'Community Youth Action Taskforce',
          startDate: 'Current Month',
          targetCompletionDate: 'Under Community Review',
          locationLandmark: finalGeotag,
        });
      } else {
        // Fallback to reporting under first available project
        onSubmitReport(
          projects[0]?.id || 'proj_01',
          statusClaimed,
          `[New Need: ${newNeedTitle}] ${reportNote.trim()}`,
          capturedPhoto || undefined,
          coordinates || undefined,
          finalGeotag,
          'New Infrastructure Need',
          priority
        );
      }
    }

    // Reset and close
    setReportNote('');
    setCapturedPhoto(null);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider">
                  Field Cam & Geotag
                </span>
                <span className="text-[10px] text-amber-300 font-mono">
                  +35 Civic Reputation Points
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                Capture & Geotag Infrastructure Report
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Step 1: Reporting Mode Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              1. Report Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReportTargetMode('existing')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  reportTargetMode === 'existing'
                    ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm">Update Existing Project</div>
                <div className="text-[11px] opacity-80 mt-0.5">Log progress on a tracked ward project</div>
              </button>

              <button
                type="button"
                onClick={() => setReportTargetMode('new-need')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  reportTargetMode === 'new-need'
                    ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm">New Infrastructure Need</div>
                <div className="text-[11px] opacity-80 mt-0.5">Report broken culvert, borehole, road issue</div>
              </button>
            </div>
          </div>

          {/* Target Project Dropdown OR New Need Inputs */}
          {reportTargetMode === 'existing' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Select Tracked Capital Project
              </label>
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.lga} · {p.wardName}] {p.title} ({p.status})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Infrastructure Need Title
                </label>
                <input
                  type="text"
                  required={reportTargetMode === 'new-need'}
                  value={newNeedTitle}
                  onChange={e => setNewNeedTitle(e.target.value)}
                  placeholder="e.g. Broken Handrail on Odo-Ode Culvert, Faulty Solar Transformer..."
                  className="w-full px-3.5 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newNeedCategory}
                    onChange={e => setNewNeedCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  >
                    <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                    <option value="Water & Boreholes">Water & Boreholes</option>
                    <option value="Solar & Power">Solar & Power</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education & Schools">Education & Schools</option>
                    <option value="Agribusiness & Markets">Agribusiness & Markets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Political Ward
                  </label>
                  <select
                    value={newNeedWardId}
                    onChange={e => {
                      setNewNeedWardId(e.target.value);
                      const all = [...IDANRE_WARDS, ...IFEDORE_WARDS];
                      const w = all.find(item => item.id === e.target.value);
                      if (w) setNewNeedLga(w.lga);
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                  >
                    <optgroup label="Idanre LGA (10 Wards)">
                      {IDANRE_WARDS.map(w => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.code})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Ifedore LGA (10 Wards)">
                      {IFEDORE_WARDS.map(w => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.code})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Camera Capture Viewport & Snap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>2. Visual Proof Photo</span>
              </label>
              <span className="text-[11px] text-stone-400 font-mono">Camera / Gallery</span>
            </div>

            {/* Live Camera Viewfinder OR Captured Preview OR Prompt */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-white min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center border border-stone-800">
              {cameraActive ? (
                // Live Viewfinder
                <div className="relative w-full h-full min-h-[260px] flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full max-h-[300px] object-cover"
                  />
                  {/* Viewfinder Overlay HUD */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/40 m-4 rounded-xl flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-mono font-bold animate-pulse">
                        ● LIVE CAM
                      </span>
                      {coordinates && (
                        <span className="px-2 py-0.5 rounded bg-black/70 text-emerald-400 text-[10px] font-mono">
                          GPS: ±{coordinates.accuracy}m
                        </span>
                      )}
                    </div>
                    <div className="text-center text-[11px] font-mono text-white/70">
                      Frame the work site / damage clearly
                    </div>
                  </div>

                  {/* Shutter Controls Bar */}
                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4 z-20">
                    <button
                      type="button"
                      onClick={toggleFacingMode}
                      className="p-2.5 rounded-full bg-stone-800/80 text-white hover:bg-stone-700 transition-colors backdrop-blur-xs"
                      title="Switch Front/Rear Camera"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="w-14 h-14 rounded-full bg-white border-4 border-emerald-500 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-emerald-800"
                      title="Capture Photo"
                    >
                      <Camera className="w-6 h-6" />
                    </button>

                    <button
                      type="button"
                      onClick={stopCamera}
                      className="p-2.5 rounded-full bg-stone-800/80 text-white hover:bg-stone-700 transition-colors backdrop-blur-xs"
                      title="Close Camera"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : capturedPhoto ? (
                // Captured Photo Preview with Geotag Overlay
                <div className="relative w-full h-full min-h-[240px] max-h-[300px] overflow-hidden group">
                  <img
                    src={capturedPhoto}
                    alt="Captured Field Evidence"
                    className="w-full h-full object-cover max-h-[280px]"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Evidence Captured & Geotag Stamped</span>
                      </div>
                      {coordinates && (
                        <div className="text-[10px] font-mono text-stone-300">
                          {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCapturedPhoto(null);
                        startCamera();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retake</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Initial Camera Prompt
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-100">Live Camera or Image Upload</h4>
                    <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                      Photograph progress, grading caterpillars, or defective community facilities directly from your phone or browser.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Launch Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border border-stone-700"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                    </button>
                  </div>

                  {cameraError && (
                    <div className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/40 p-2 rounded-xl mt-2 flex items-center gap-2 text-left">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{cameraError}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Step 3: Geotag & Location Pin */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>3. GPS Geotag & Ward Pin</span>
              </label>

              <button
                type="button"
                onClick={fetchCurrentLocation}
                disabled={isLocating}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
              </button>
            </div>

            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{geotagLabel || 'Detecting closest ward landmark...'}</span>
                </span>
                {coordinates && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold">
                    ±{coordinates.accuracy}m GPS Accuracy
                  </span>
                )}
              </div>

              {coordinates && (
                <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  Latitude: {coordinates.lat.toFixed(6)}° · Longitude: {coordinates.lng.toFixed(6)}°
                </div>
              )}

              {/* Manual Ward & Landmark Refinement */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase">
                    Ward Override / Refinement
                  </label>
                  <select
                    value={manualWard}
                    onChange={e => setManualWard(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                  >
                    <optgroup label="Idanre LGA">
                      {IDANRE_WARDS.map(w => (
                        <option key={w.id} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Ifedore LGA">
                      {IFEDORE_WARDS.map(w => (
                        <option key={w.id} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase">
                    Landmark / Street Spot
                  </label>
                  <input
                    type="text"
                    value={manualLandmark}
                    onChange={e => setManualLandmark(e.target.value)}
                    placeholder="e.g. Near Odode Junction, Market gate..."
                    className="w-full mt-0.5 px-2.5 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Status Claim & Observations */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              4. Observed Ground Status & Details
            </label>

            {/* Status Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['In Progress', 'Completed', 'Stalled', 'Not Started'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusClaimed(st)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    statusClaimed === st
                      ? 'border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {st === 'Completed' ? '✓ Completed' : st}
                </button>
              ))}
            </div>

            {/* Priority & Report Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  Report Nature
                </label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                >
                  <option value="Project Update">Project Execution Update</option>
                  <option value="New Infrastructure Need">New Infrastructure Need</option>
                  <option value="Urgent Defect / Hazard">Urgent Defect / Safety Hazard</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  Severity / Urgency Priority
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                >
                  <option value="Moderate">Moderate (Standard follow-up)</option>
                  <option value="High / Critical">High / Critical (Urgent public risk)</option>
                  <option value="Routine">Routine (Progress verification)</option>
                </select>
              </div>
            </div>

            {/* Field Note */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Detailed Field Note & Citizen Testimony
              </label>
              <textarea
                required
                rows={3}
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
                placeholder="Describe what you observed on site: e.g. 'Caterpillar grader is actively shaping road shoulders', 'Water pump handle snapped off yesterday', 'Solar inverters operational'..."
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Community Verification Disclaimer */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Public Community Verification:</strong> Once published, other residents of {user.lga} and your ward can view your geotagged coordinates, confirm your report on the ground, and upvote verification. You will earn <strong>+35 Civic Points</strong>.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Verified Report (+35 Pts)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
