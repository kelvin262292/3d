if (process.env.NODE_ENV === 'development') {
  import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
    const config = { plugins: [] };
    const toolbarRoot = document.createElement('div');
    document.body.appendChild(toolbarRoot);
    import('react-dom/client').then(({ createRoot }) => {
      createRoot(toolbarRoot).render(<StagewiseToolbar config={config} />);
    });
  });
}
