import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardBody, Heading, TextInput, Text, Tabs, Tab, Table, TableHeader, TableRow, TableCell, TableBody, Meter, DataTable, Spinner } from 'grommet';
import { Secure, Login, Logout, CircleAlert, StatusGood, Clock } from 'grommet-icons';
import { fetchDiagnostics, adminLogin } from '../api';
import Background from '../components/Background';
import HomeButton from '../components/HomeButton';
import ExpandableInputCell from '../components/ExpandableInputCell'

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const passwordInputRef = React.useRef(null);

  // Check if user is already authenticated
  useEffect(() => {
    const authToken = localStorage.getItem('adminAuth');
    if (authToken === 'true') {
      setIsAuthenticated(true);
      loadDiagnostics();
    }
  }, []);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    
    // Schedule focus restoration after render
    requestAnimationFrame(() => {
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Use dummy password
      if (password === 'admin123') {
        localStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        await loadDiagnostics();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setDiagnosticsData(null);
  };

  const loadDiagnostics = async () => {
    setLoading(true);
    try {
      const data = await fetchDiagnostics();
      setDiagnosticsData(data);
    } catch (err) {
      setError('Failed to load diagnostics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const LoginForm = () => (
    <Card background="light-1" width="medium" elevation="small">
      <CardBody pad="medium">
        <Box align="center" margin={{ bottom: 'medium' }}>
          <Secure size="large" color="brand" />
          <Heading level={2} margin={{ top: 'small' }}>Admin Login</Heading>
        </Box>
        <Box gap="medium">
          <TextInput
            placeholder="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onKeyDown ={(e) => e.key === 'Enter' && handleLogin()}
            ref={passwordInputRef}
          />
          {error && <Text color="status-critical">{error}</Text>}
          <Button
            icon={<Login />}
            label="Login"
            onClick={handleLogin}
            primary
            disabled={loading}
          />
        </Box>
      </CardBody>
    </Card>
  );

  // Dashboard components
  const UserMetrics = () => (
    <Box>
      <Heading level={3}>User Statistics</Heading>
      <Box direction="row" gap="medium">
        <Card background="light-1" pad="medium" width="small">
          <Heading level={4} margin="none">Total Users</Heading>
          <Text size="xxlarge" weight="bold">{diagnosticsData?.userCount || 0}</Text>
        </Card>
        <Card background="light-1" pad="medium" width="small">
          <Heading level={4} margin="none">Active Today</Heading>
          <Text size="xxlarge" weight="bold">{diagnosticsData?.activeUsers?.today || 0}</Text>
        </Card>
        <Card background="light-1" pad="medium" width="small">
          <Heading level={4} margin="none">Success Rate</Heading>
          <Box align="center">
            <Meter
              type="circle"
              value={diagnosticsData?.successRate || 0}
              size="small"
              thickness="medium"
            />
            <Text weight="bold">{`${Math.round(diagnosticsData?.successRate || 0)}%`}</Text>
          </Box>
        </Card>
      </Box>
    </Box>
  );

  const SolverPerformance = () => {
    // Format solver data for the table
    const solverData = diagnosticsData?.solvers?.map(solver => ({
      ...solver,
      successRate: `${Math.round(solver.successRate * 100)}%`,
      avgExecutionTime: `${solver.avgExecutionTime.toFixed(2)}ms`
    })) || [];

    return (
      <Box>
        <Heading level={3}>Solver Performance</Heading>
        <DataTable
          columns={[
            { property: 'name', header: 'Solver', primary: true },
            { property: 'callCount', header: 'Total Calls' },
            { property: 'successRate', header: 'Success Rate' },
            { property: 'avgExecutionTime', header: 'Avg. Execution Time' }
          ]}
          data={solverData}
          sort={{ property: 'callCount', direction: 'desc' }}
          background={{
            header: { color: 'brand', opacity: 'strong' },
            body: ['light-1', 'light-2']
          }}
        />
      </Box>
    );
  };

  const RecentActivity = () => (
    <Box>
      <Heading level={3}>Recent Activity</Heading>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell scope="col" border="bottom">Timestamp</TableCell>
            <TableCell scope="col" border="bottom">Solver</TableCell>
            <TableCell scope="col" border="bottom">Input</TableCell>
            <TableCell scope="col" border="bottom">Status</TableCell>
            <TableCell scope="col" border="bottom">Execution Time</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(diagnosticsData?.recentActivity || []).map((activity, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
              <TableCell>{activity.solver}</TableCell>
              <TableCell>
                <Box width="300px" overflow={{ horizontal: 'auto' }}>
                  <ExpandableInputCell input={activity.input} />
                </Box>
              </TableCell>
              <TableCell>
                {activity.success ? 
                  <Box direction="row" align="center" gap="xsmall">
                    <StatusGood size="small" color="status-ok" />
                    <Text color="status-ok">Success</Text>
                  </Box> : 
                  <Box direction="row" align="center" gap="xsmall">
                    <CircleAlert size="small" color="status-critical" />
                    <Text color="status-critical">Failed</Text>
                  </Box>}
              </TableCell>
              <TableCell>
                <Box direction="row" align="center" gap="xsmall">
                  <Clock size="small" />
                  <Text>{activity.executionTime}ms</Text>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );

  // Main dashboard component
  const Dashboard = () => (
    <Box flex gap="medium" pad="medium">
      <Box direction="row" justify="between" align="center">
        <Heading level={2} margin="none">Diagnostics Dashboard</Heading>
        <Box direction="row" gap="small" align="center">
          <Button 
            icon={<Logout />} 
            label="Logout" 
            onClick={handleLogout} 
            plain
          />
          <Button 
            label="Refresh Data" 
            onClick={loadDiagnostics} 
            primary
            disabled={loading}
          />
        </Box>
      </Box>

      {loading ? (
        <Box align="center" justify="center" height="medium">
          <Spinner size="large" />
          <Text margin={{ top: 'small' }}>Loading diagnostics data...</Text>
        </Box>
      ) : error ? (
        <Box background="status-warning" pad="medium" round="small">
          <Text color="status-critical">{error}</Text>
        </Box>
      ) : (
        <Tabs activeIndex={activeTab} onActive={setActiveTab}>
          <Tab title="Overview">
            <Box pad="medium" gap="medium">
              <UserMetrics />
              <SolverPerformance />
            </Box>
          </Tab>
          <Tab title="Recent Activity">
            <Box pad="medium">
              <RecentActivity />
            </Box>
          </Tab>
        </Tabs>
      )}
    </Box>
  );

  return (
    <Box fill background="light-3">
      <Background />
      <Box align="start" pad="small" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <HomeButton />
      </Box>
      <Box 
        align="center" 
        justify="center" 
        pad="medium"
        height={{ min: '100vh' }}
      >
        {isAuthenticated ? <Dashboard /> : <LoginForm />}
      </Box>
    </Box>
  );
};

export default AdminPanel;