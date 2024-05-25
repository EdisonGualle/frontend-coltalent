export const getEmployees = () => {
  const data = [
      {
        id: 1,
        name: 'Jane Cooper',
        email: 'jane.cooper@example.com',
        title: 'Regional Paradigm Technician',
        department: 'Optimization',
        status: 'Active',
        role: 'Admin',
        cedula: '123456789',
        age: 27,
        imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      },
      {
        id: 2,
        name: 'Cody Fisher',
        email: 'cody.fisher@example.com',
        title: 'Product Directives Officer',
        department: 'Intranet',
        status: 'Inactive',
        role: 'Owner',
        cedula: '123452323',
        age: 43,
        imgUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      },
      {
        id: 3,
        name: 'Esther Howarsefefsefd',
        email: 'esther.howard@example.com',
        title: 'Forward Response Developer',
        department: 'Directives',
        status: 'Active',
        role: 'Member',
        cedula: '123456789',
        age: 32,
        imgUrl: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      },
      {
        id: 4,
        name: 'Jenny Wilson',
        email: 'jenny.wilson@example.com',
        title: 'Central Security Manager',
        department: 'Program',
        status: 'Offline',
        role: 'Member',
        cedula: '123456789',
        age: 29,
      },
      {
        id: 5,
        name: 'Kristin Watson',
        email: 'kristin.watson@example.com',
        title: 'Lean Implementation Liaison',
        department: 'Mobility',
        status: 'Inactive',
        role: 'Admin',
        cedula: '123456789',
        age: 36,
        imgUrl: 'https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      },
      {
        id: 6,
        name: 'Cameron Williamson',
        email: 'cameron.williamson@example.com',
        title: 'Internal Applications Engineer',
        department: 'Security',
        status: 'Active',
        role: 'Member',
        cedula: '123456789',
        age: 24,
        imgUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      },
      {
        id: 7,
        name: 'Cameron Williamson',
        email: 'cameron.williamson@example.com',
        title: 'Internal Applications Engineer',
        department: 'Security',
        status: 'Active',
        role: 'Member',
        cedula: '123456789',
        age: 24,
        imgUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      },
      {
        id: 8,
        name: 'Cameron Williamson',
        email: 'cameron.williamson@example.com',
        title: 'Internal Applications Engineer',
        department: 'Security',
        status: 'Active',
        role: 'Member',
        cedula: '123456789',
        age: 24,
        imgUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      },
      // Se agregan más empleados aquí con IDs en secuencia
      // Asegúrate de que cada ID sea único y en secuencia
    ];
    
    // Asegurar que haya al menos 21 registros
    while (data.length < 21) {
        const lastId = data[data.length - 1].id;
        const newEmployee = {
            id: lastId + 1,
            name: 'Empleado ' + (lastId + 1),
            email: 'empleado' + (lastId + 1) + '@example.com',
            title: 'Cargo ' + (lastId + 1),
            department: 'Departamento ' + (lastId + 1),
            status: 'Activo',
            role: 'Miembro',
            cedula: '123456789',
            age: 30,
        };
        data.push(newEmployee);
    }
    
    // Recortar la lista para que solo haya 21 empleados
    return data.slice(0, 21);
};
