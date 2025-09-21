'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { StoreConfigaration } from '@/constant';
import { Order } from '@/types';





const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    display: 'flex',
    width: 'auto',
  },
  tableRow: {
    flexDirection: 'row',

  },
  tableRowHead: {
    flexDirection: 'row',
    backgroundColor:"#000",
    color:"#fff"
  },
  tableHeader: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    flexDirection: 'row',
  },
  tableCell: {
    width: '14.28%',
    padding: 7,
    fontSize: 9,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0,
    borderRightColor: '#E0E0E0',
    borderRightWidth: 0,
  },
  tableCellHeader: {
    padding: 8,
    fontSize: 10,
    color: '#FFFFFF',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0,
    borderRightColor: '#E0E0E0',
    borderRightWidth: 0,
  },
  tableCellAddress: {
    width: '28.56%',
  },
});

type Props = {
  orders: Order[];
};

const OrderListPDF = ({ orders, storeName }: { orders: Order[], storeName: string }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <Text style={styles.header}>
        {storeName} - Orders Report
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRowHead}>
          <Text style={[styles.tableCellHeader, { width: '14.28%', borderLeftWidth: 0, borderTopWidth: 0 }]}>Name</Text>
          <Text style={[styles.tableCellHeader, { width: '14.28%', borderTopWidth: 0 }]}>Phone</Text>
          <Text style={[styles.tableCellHeader, { width: '14.28%', borderTopWidth: 0 }]}>Payment</Text>
          <Text style={[styles.tableCellHeader, { width: '14.28%', borderTopWidth: 0 }]}>TRX ID</Text>
          <Text style={[styles.tableCellHeader, { width: '14.28%', borderTopWidth: 0 }]}>Total</Text>
          <Text style={[styles.tableCellHeader, { width: '14.28%', borderTopWidth: 0 }]}>Status</Text>
          <Text style={[styles.tableCellHeader, { width: '28.56%', borderTopWidth: 0, borderRightWidth: 0 }]}>Address</Text>
        </View>
        {orders.map((o, idx) => (
          <View key={idx} style={[styles.tableRow, { backgroundColor: idx % 2 === 0 ? '#F5F5F5' : '#FFFFFF' }]}>
            <Text style={[styles.tableCell, { width: '14.28%', borderLeftWidth: 0 }]}>{o.name}</Text>
            <Text style={[styles.tableCell, { width: '14.28%' }]}>{o.phone}</Text>
            <Text style={[styles.tableCell, { width: '14.28%' }]}>{o.payment_method}</Text>
            <Text style={[styles.tableCell, { width: '14.28%' }]}>{o.trx_id}</Text>
            <Text style={[styles.tableCell, { width: '14.28%' }]}>{o.total.toString()}</Text>
            <Text style={[styles.tableCell, { width: '14.28%' }]}>{o.status?"Confirmed":"Pending"}</Text>
            <Text style={[styles.tableCell, { width: '28.56%', borderRightWidth: 0 }]}>{o.address}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default function GeneratePDFReport({ orders }: Props) {
  if (!orders || orders.length === 0) return null;

  return (
    <PDFDownloadLink
      document={<OrderListPDF orders={orders} storeName={StoreConfigaration.storeInfo.name} />}
      fileName={`orders_report_${new Date().toISOString()}.pdf`}
    >
      {({ loading }) => (
        <Button variant="default" className="flex items-center gap-2 cursor-pointer" disabled={loading}>
          <FileText size={16} />
          {loading ? 'Generating...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
