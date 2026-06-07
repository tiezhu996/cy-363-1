import { useEffect, useState, useCallback } from "react";
import { Button, ConfigProvider, Layout, Typography, theme, Space } from "antd";
import { ApiOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { fetchOverview } from "./api/client";
import { APP_CODE, APP_NAME, APP_THEME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { createFallbackOverview } from "./state/dashboard";
import type { OverviewResponse, RevenueRecord } from "./types";
import { FeatureStrip } from "./components/FeatureStrip";
import { MetricGrid } from "./components/MetricGrid";
import { OperationsTable } from "./components/OperationsTable";
import { RevenueFormModal } from "./components/RevenueFormModal";
import { RevenueHistory } from "./components/RevenueHistory";

const { Header, Content } = Layout;

export default function App() {
  const [overview, setOverview] = useState<OverviewResponse>(createFallbackOverview());
  const [notice, setNotice] = useState(REQUEST_MESSAGES.overviewFallback);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RevenueRecord | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadOverview = useCallback(() => {
    fetchOverview()
      .then((payload) => {
        setOverview(payload);
        setNotice("后端服务已联通，当前展示实时接口数据。");
      })
      .catch(() => setNotice(REQUEST_MESSAGES.overviewFallback));
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview, refreshTrigger]);

  const handleAddRevenue = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleEditRevenue = (record: RevenueRecord) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    loadOverview();
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: APP_THEME.accent,
          colorText: APP_THEME.ink,
          colorBgBase: APP_THEME.paper,
          borderRadius: 8,
        },
      }}
    >
      <Layout className="app-shell">
        <Header className="topbar">
          <div className="brand-block">
            <span className="brand-code">{APP_CODE}</span>
            <h1 className="brand-title">{APP_NAME}</h1>
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRevenue}>
              营收录入
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新数据
            </Button>
            <Button type="default" icon={<ApiOutlined />} href={REQUEST_MESSAGES.healthPath}>
              API Health
            </Button>
          </Space>
        </Header>
        <Content className="workspace">
          <section className="lead-grid">
            <article className="hero-panel">
              <span className="pill">{notice}</span>
              <Typography.Title level={2}>{overview.appName}</Typography.Title>
              <p>{overview.description}</p>
            </article>
            <MetricGrid items={overview.kpis} />
          </section>
          <FeatureStrip items={overview.features} />
          <section className="work-panel">
            <Typography.Title level={3}>运营任务流</Typography.Title>
            <OperationsTable records={overview.records} />
          </section>
          <RevenueHistory onEdit={handleEditRevenue} refreshTrigger={refreshTrigger} />
        </Content>
      </Layout>

      <RevenueFormModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleFormSuccess}
        editingRecord={editingRecord}
      />
    </ConfigProvider>
  );
}
