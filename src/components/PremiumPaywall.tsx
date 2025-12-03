// src/components/PremiumPaywall.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type PlanType = 'lifetime' | 'annual' | 'monthly';

export default function PremiumPaywall({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('lifetime');
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
        setPackages(offerings.current.availablePackages);
        console.log('Loaded packages:', offerings.current.availablePackages.length);
      } else {
        console.log('No offerings available');
      }
    } catch (error) {
      console.error('Error loading offerings:', error);
      Alert.alert('Error', 'Failed to load subscription options. Please try again.');
    } finally {
      setLoadingPackages(false);
    }
  };

  const getPackageByIdentifier = (identifier: string): PurchasesPackage | undefined => {
    return packages.find(pkg => 
      pkg.identifier === `$rc_${identifier}` || 
      pkg.product.identifier.includes(identifier)
    );
  };

  const getPrice = (planType: PlanType): string => {
    const pkg = getPackageByIdentifier(planType);
    return pkg?.product.priceString || 
      (planType === 'lifetime' ? '$79.99' : planType === 'annual' ? '$49.99' : '$9.99');
  };

  const plans = {
    lifetime: {
      price: getPrice('lifetime'),
      label: 'Lifetime',
      description: 'One-time payment, unlock forever',
      badge: 'BEST VALUE',
      savings: 'Save 87%',
    },
    annual: {
      price: getPrice('annual'),
      label: 'Annual',
      description: 'Billed yearly',
      badge: 'MOST POPULAR',
      savings: 'Save 58%',
    },
    monthly: {
      price: getPrice('monthly'),
      label: 'Monthly',
      description: 'Billed monthly',
      badge: null,
      savings: null,
    },
  };

  const handlePurchase = async () => {
    setLoading(true);
    
    try {
      const pkg = getPackageByIdentifier(selectedPlan);
      
      if (!pkg) {
        Alert.alert('Error', 'Selected plan not available. Please try another plan.');
        setLoading(false);
        return;
      }

      const purchaseResult = await Purchases.purchasePackage(pkg);
      
      // Check if user now has premium entitlement
      if (purchaseResult.customerInfo.entitlements.active['FlowState: Keep Your Focus Premium']) {
        onSuccess();
        Alert.alert('Success!', 'Premium unlocked! 🎉');
      }
      
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert('Error', 'Purchase failed. Please try again.');
        console.error('Purchase error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    
    try {
      const restoreResult = await Purchases.restorePurchases();
      
      if (restoreResult.entitlements.active['FlowState: Keep Your Focus Premium']) {
        onSuccess();
        Alert.alert('Restored!', 'Premium restored successfully! 🎉');
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases to restore.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
      console.error('Restore error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPackages) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading subscription options...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name={"x" as any} size={28} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Unlock Premium</Text>
        <Text style={styles.headerSubtitle}>
          Get unlimited access to all features
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>
          {(Object.keys(plans) as PlanType[]).map((planKey) => {
            const plan = plans[planKey];
            const isSelected = selectedPlan === planKey;
            
            return (
              <TouchableOpacity
                key={planKey}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan(planKey)}
              >
                {plan.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{plan.badge}</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <Text style={styles.planLabel}>{plan.label}</Text>
                  {plan.savings && (
                    <Text style={styles.planSavings}>{plan.savings}</Text>
                  )}
                </View>
                
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
                
                <View style={styles.radioButton}>
                  {isSelected && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Premium Features:</Text>
          
          {[
            { icon: 'droplet', text: '3 Premium Themes' },
            { icon: 'music', text: '4 Ambient Sounds' },
            { icon: 'moon', text: 'Sleep Timer Mode' },
            { icon: 'zap', text: 'AI Focus Coach (Coming Soon)' },
            { icon: 'bar-chart-2', text: 'Advanced Analytics (Coming Soon)' },
            { icon: 'cloud', text: 'Cloud Sync (Coming Soon)' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Feather name={feature.icon as any} size={20} color="#3B82F6" />
              <Text style={styles.featureText}>{feature.text}</Text>
              <Feather name={"check" as any} size={20} color="#10B981" />
            </View>
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handlePurchase}
          disabled={loading || packages.length === 0}
        >
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            style={styles.ctaGradient}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.ctaText}>
                  {selectedPlan === 'lifetime'
                    ? 'Get Lifetime Access'
                    : 'Subscribe Now'}
                </Text>
                <Text style={styles.ctaSubtext}>
                  {plans[selectedPlan].price}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Restore Button */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={loading}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Legal Text */}
        <Text style={styles.legalText}>
          {selectedPlan !== 'lifetime'
            ? 'Subscription auto-renews. Cancel anytime in Settings.'
            : 'One-time payment. No subscription required.'}
        </Text>
        
        <Text style={styles.legalText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pricingContainer: {
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  planSavings: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  radioButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  featuresContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  featureText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  ctaButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  ctaGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ctaSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  restoreButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  restoreText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  legalText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
});