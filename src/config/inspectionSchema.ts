export type InspectionOption = {
  name: string;
  label: string;
};

export type InspectionCategory = {
  name: string;
  label: string;
  order: number;
  options: InspectionOption[];
};

export const inspectionSchema = {
  preInspection: [
    { name: 'rams_info_submitted', label: 'RAMS information submitted', order: 1 },
    { name: 'wall_type_drawings', label: 'Wall Type Drawings available', order: 2 },
    { name: 'induction_arranged', label: 'Induction arranged', order: 3 },
    { name: 'induction_attended', label: 'Induction attended', order: 4 },
    { name: 'ppe_checked', label: 'PPE (incl glasses and sleeves for Wates)', order: 5 },
    { name: 'client_meeting', label: 'Meet with client representative', order: 6 },
    { name: 'fire_drawings_available', label: 'Latest fire strategy drawings available', order: 7 },
    { name: 'bolster_uploads', label: 'Bolster uploads completed', order: 8 },
    { name: 'bolster_synced', label: 'Bolster down synced and checked', order: 9 },
    { name: 'latest_eta_available', label: 'Latest Manufacturer ETAs', order: 10 },
    { name: 'walkthrough_done', label: 'Walk through and cursory inspection', order: 11 },
  ],

  projectInformation: [
    { name: 'project_name', label: 'Project Name', order: 1 },
    { name: 'project_reference', label: 'Project Reference', order: 2 },
    { name: 'inspection_date', label: 'Inspection Date', order: 3, type: 'date' },
    { name: 'inspection_number', label: 'Inspection Number', order: 4 },
    { name: 'client', label: 'Client',  order: 5 },    
    { name: 'client_contact', label: 'Client Contact & Title', order: 6 },
    { name: 'client_rep', label: 'Client Site Rep & Title', order: 7 },
    { name: 'installer', label: 'Installer/contractor', order: 8 },
    { name: 'barrier_materials_ceiling', label: 'Barrier materials - Ceiling void', order: 9 },
    { name: 'third_party_acr', label: '3rd Party Acr. Body', order: 10 },
    { name: 'digital_recording', label: 'Digital Recording', order: 11 },
    { name: 'storeys', label: 'Storeys', order: 12, type: 'number' },
    { name: 'structural_frame', label: 'Structural Frame', order: 13 },
    { name: 'façade', label: 'Façade', order: 14 },
    { name: 'floor_type', label: 'Floor Type',  order: 15 },
    { name: 'internal_walls', label: 'Internal Walls Types', order: 16 },
    { name: 'fire_stopping_materials', label: 'Fire Stopping Materials', order: 17 },
    { name: 'barrier_materials', label: 'Barrier materials - external', order: 18 },
    { name: 'barrier_materials_raf', label: 'Barrier materials - RAF external', order: 19 },
    { name: 'dampers', label: 'Dampers', order: 20 },
    { name: 'encasements', label: 'Encasements', order: 21 },
  ],

  postInspection: [
    { name: 'client_meeting_done', label: 'Meet with client representative', order: 1 },
    { name: 'next_inspection_date', label: 'Date of next inspection visit', order: 2, type: 'date' },
    { name: 'urgent_matters', label: 'Communicate urgent matters', order: 3 },
    { name: 'bolster_notes', label: 'Up-sync Bolster', order: 4 },
    { name: 'comment', label: 'Comment', order: 5 },
  ],

  siteInspections: [
    {
      name: 'encasements',
      label: 'Encasements',
      order: 1,
      options: [
        { name: 'thickness', label: 'thickness' },
        { name: 'fixing', label: 'fixing(type/centres/orientation)' },
        { name: 'framing', label: 'framing' },
        { name: 'joints', label: 'joints' },
        { name: 'junctions', label: 'junctions' },
        { name: 'overlaps', label: 'overlaps' },
        { name: 'any_penetrations', label: 'any penetrations' },
      ]
    },
    {
      name: 'wall_makeup',
      label: 'Wall Makeup',
      order: 2,
      options: [
        { name: 'layers', label: 'layers' },
        { name: 'thickness', label: 'thickness' },
        { name: 'framing_system', label: 'framing system' },
      ]
    },
    {
      name: 'letterbox_openings',
      label: 'Letterbox Openings',
      order: 3,
      options: [
        { name: 'framing', label: 'framing' },
        { name: 'lining', label: 'lining' },
        { name: 'tape_jointing', label: 'tape & jointing' },
      ]
    },
    {
      name: 'linear_joint_seals',
      label: 'Linear Joint Seals',
      order: 4,
      options: [
        { name: 'compression', label: 'compression' },
        { name: 'gap_size', label: 'gap size' },
        { name: 'depth', label: 'depth' },
        { name: 'sealant', label: 'sealant' },
        { name: 'backing_material', label: 'backing material' },
      ]
    },
    {
      name: 'trapezoidal_voids',
      label: 'Trapezoidal Voids',
      order: 5,
      options: [
        { name: 'infilled', label: 'infilled' },
        { name: 'sealant', label: 'sealant' },
      ]
    },
    {
      name: 'fire_stopping_friction_fitted',
      label: 'Fire Stopping, Friction Fitted',
      order: 6,
      options: [
        { name: 'opening', label: 'opening (size/spacing etc)' },
        { name: 'service_spacing', label: 'service spacing' },
        { name: 'layers', label: 'layers' },
        { name: 'edge_joint_coating', label: 'edge/joint coating' },
        { name: 'lagging', label: 'lagging' },
        { name: 'closure_devices', label: 'closure devices' },
        { name: 'service_supports', label: 'service supports' },
        { name: 'fitted_es', label: 'fitted e/s' },
        { name: 'fixings', label: 'fixings' },
      ]
    },
    {
      name: 'fire_stopping_horizontal',
      label: 'Fire Stopping, Horizontal',
      order: 7,
      options: [
        { name: 'substrate', label: 'substrate' },
        { name: 'shutter', label: 'shutter' },
        { name: 'layers', label: 'layers' },
        { name: 'depth', label: 'depth' },
        { name: 'closure_devices', label: 'closure devices' },
        { name: 'fixings', label: 'fixings' },
      ]
    },
    {
      name: 'fire_stopping_face_fixed',
      label: 'Fire Stopping, Face Fixed',
      order: 8,
      options: [
        { name: 'fixings', label: 'fixings' },
        { name: 'overlaps', label: 'overlaps' },
        { name: 'service_spacing', label: 'service spacing' },
        { name: 'closure_devices', label: 'closure devices' },
        { name: 'lagging', label: 'lagging' },
        { name: 'edge_coating', label: 'edge coating' },
        { name: 'service_supports', label: 'service supports' },
      ]
    },
    {
      name: 'fire_stopping_direct_seal',
      label: 'Fire Stopping, Direct Seal',
      order: 9,
      options: [
        { name: 'size', label: 'size' },
        { name: 'annulus', label: 'annulus' },
        { name: 'depth', label: 'depth' },
      ]
    },
    {
      name: 'fire_stopping_closure_devices',
      label: 'Fire Stopping, Closure Devices',
      order: 10,
      options: [
        { name: 'pipe_type', label: 'pipe/insulation type/diameter' },
        { name: 'annulus', label: 'annulus' },
        { name: 'depth', label: 'depth' },
        { name: 'layers', label: 'layers' },
        { name: 'fixings', label: 'fixings' },
        { name: 'diameter', label: 'diameter' },
        { name: 'fitted_to_plain_pipe', label: 'fitted to plain pipe' },
      ]
    },
    {
      name: 'dampers',
      label: 'Dampers',
      order: 11,
      options: [
        { name: 'opening', label: 'opening (size/spacing etc)' },
        { name: 'opening_infill', label: 'opening infill' },
        { name: 'dimensions_to_casing', label: 'dimensions to casing' },
        { name: 'fixings', label: 'fixings' },
        { name: 'supports', label: 'supports' },
        { name: 'plasterboard_pattress', label: 'plasterboard pattress' },
      ]
    },
    {
      name: 'putty_pads',
      label: 'Putty Pads',
      order: 12,
      options: [
        { name: 'sealed', label: 'sealed' },
        { name: 'suitable_openings_size', label: 'suitable openings size' },
        { name: 'spacing_of_opening', label: 'spacing of opening' },
      ]
    },
    {
      name: 'cavity_barriers_ceiling_void',
      label: 'Cavity Barriers, Ceiling Void',
      order: 13,
      options: [
        { name: 'substrate', label: 'substrate' },
        { name: 'brackets', label: 'brackets' },
        { name: 'fixings', label: 'fixings' },
        { name: 'joints', label: 'joints' },
        { name: 'overlaps', label: 'overlaps' },
        { name: 'stitching', label: 'stitching' },
        { name: 'stapling', label: 'stapling' },
        { name: 'penetrations', label: 'penetrations' },
      ]
    },
    {
      name: 'cavity_barriers_raf',
      label: 'Cavity Barriers, RAF',
      order: 14,
      options: [
        { name: 'compression', label: 'compression' },
        { name: 'brackets', label: 'brackets' },
        { name: 'fixings', label: 'fixings' },
        { name: 'joints', label: 'joints' },
        { name: 'sealants', label: 'sealants' },
        { name: 'tapes', label: 'tapes' },
      ]
    },
    {
      name: 'cavity_barriers_external',
      label: 'Cavity Barriers External',
      order: 15,
      options: [
        { name: 'substrate', label: 'substrate' },
        { name: 'compression', label: 'compression' },
        { name: 'brackets', label: 'brackets' },
        { name: 'fixings', label: 'fixings' },
        { name: 'joints', label: 'joints' },
        { name: 'sealants', label: 'sealants' },
        { name: 'tapes', label: 'tapes' },
      ]
    },
    {
      name: 'destructive_tests',
      label: 'Destructive Tests',
      order: 16,
      options: [
        { name: 'carried_out', label: 'carried out?' },
      ]
    }
  ]

};
