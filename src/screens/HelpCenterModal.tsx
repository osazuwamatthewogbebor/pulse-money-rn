// src/screens/HelpCenterModal.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface HelpCenterModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do instant ACH transfers work?',
    answer:
      'Transfers sent to other Pulse users arrive in under 5 seconds. Standard external bank ACH transfers settle via Federal Reserve FedNow instant rail, meaning funds are available immediately 24/7/365 with zero settlement delays.',
  },
  {
    id: 'faq-2',
    question: 'What are my daily and monthly transfer limits?',
    answer:
      'Your verified Tier 2 account has a daily transfer limit of $10,000 and a monthly spending limit of $50,000. You can customize your virtual debit card limit at any time from the Cards tab.',
  },
  {
    id: 'faq-3',
    question: 'How does the virtual card freeze protect me?',
    answer:
      'Tapping Freeze Card immediately blocks all POS, chip, and online transactions on the Visa/Mastercard network. Recurring subscriptions can also be paused. You can unfreeze your card instantly with one tap.',
  },
  {
    id: 'faq-4',
    question: 'Are my wallet deposits FDIC insured?',
    answer:
      'Yes. Deposit accounts are held with our FDIC-insured partner bank (Evolve Bank & Trust / Chase NA), providing standard pass-through insurance up to $250,000 per depositor.',
  },
  {
    id: 'faq-5',
    question: 'How do I report an unrecognized transaction?',
    answer:
      'Tap on the transaction in your Recent Transactions list or Transaction History feed, tap "Report an Issue", and our automated fraud shield will freeze that specific merchant token and issue provisional credit.',
  },
];

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  visible,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filteredFaqs = FAQS.filter(
    (f) =>
      searchQuery === '' ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartLiveChat = () => {
    Alert.alert(
      'Connecting to Pulse Support',
      'You are connected with Pulse AI Concierge (Agent Sarah). Estimated reply: Under 1 minute.',
      [{ text: 'Start Conversation' }]
    );
  };

  const handleCall = () => {
    Alert.alert('Priority Phone Desk', 'Calling +1 (800) 785-7384 (24/7 VIP Concierge)...');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Nav Bar */}
        <View style={styles.navBar}>
          <Pressable style={styles.navButton} onPress={onClose} hitSlop={8}>
            <Feather name="arrow-left" size={20} color={Colors.textMain} />
          </Pressable>
          <Text style={styles.navTitle}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Contact Cards */}
          <View style={styles.channelsRow}>
            <Pressable style={styles.channelCard} onPress={handleStartLiveChat}>
              <View style={[styles.channelIconWrap, { backgroundColor: Colors.brandSoft }]}>
                <Feather name="message-square" size={20} color={Colors.brandPrimary} />
              </View>
              <Text style={styles.channelTitle}>Live Chat</Text>
              <Text style={styles.channelSub}>2 min reply</Text>
            </Pressable>

            <Pressable style={styles.channelCard} onPress={handleCall}>
              <View style={[styles.channelIconWrap, { backgroundColor: Colors.successSoft }]}>
                <Feather name="phone-call" size={20} color={Colors.successMain} />
              </View>
              <Text style={styles.channelTitle}>Priority Call</Text>
              <Text style={styles.channelSub}>24/7 Support</Text>
            </Pressable>
          </View>

          {/* Search FAQ Bar */}
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help questions, topics..."
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                <Feather name="x" size={16} color={Colors.textMuted} />
              </Pressable>
            )}
          </View>

          {/* Frequently Asked Questions Accordion */}
          <View style={styles.faqSection}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

            <View style={styles.faqList}>
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <View key={faq.id} style={styles.faqCard}>
                    <Pressable
                      style={styles.faqHeader}
                      onPress={() =>
                        setExpandedId(isExpanded ? null : faq.id)
                      }
                    >
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <Feather
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={Colors.textMuted}
                      />
                    </Pressable>

                    {isExpanded && (
                      <View style={styles.faqBody}>
                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    backgroundColor: Colors.surface,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgMain,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textMain,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  channelsRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  channelCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    gap: 4,
  },
  channelIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
  },
  channelSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMain,
  },
  faqSection: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
  },
  faqList: {
    gap: Spacing.sm,
  },
  faqCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
    marginRight: Spacing.sm,
  },
  faqBody: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: Spacing.sm,
  },
  faqAnswer: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 19,
  },
});
